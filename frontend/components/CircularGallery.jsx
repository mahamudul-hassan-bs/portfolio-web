import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";
import { useEffect, useRef } from "react";
import Link from "next/link";
import "./CircularGallery.css";

// helpers
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}
function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function")
      instance[key] = instance[key].bind(instance);
  });
}

// Project card → WebGL texture
function createProjectCardTexture(gl, project) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 900;
  canvas.height = 520;

  // Background
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Image
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = project.image;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, 260);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, canvas.width, 260);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(project.title, 32, 320);

    // Description
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#dddddd";
    ctx.fillText(project.shortDescription, 32, 360);

    // Tech stack
    ctx.font = "18px monospace";
    project.techStack
      .slice(0, 3)
      .forEach((tech, i) => ctx.fillText(`#${tech}`, 32 + i * 140, 410));
  };

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return texture;
}

// Media class
class Media {
  constructor({
    geometry,
    gl,
    project,
    index,
    length,
    scene,
    screen,
    viewport,
    bend,
  }) {
    this.project = project;
    this.geometry = geometry;
    this.gl = gl;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen || { width: 900, height: 520 };
    this.viewport = viewport || {
      width: this.screen.width,
      height: this.screen.height,
    };
    this.bend = bend || 3;
    this.extra = 0;
    this.hovered = false;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = createProjectCardTexture(this.gl, this.project);

    this.program = new Program(this.gl, {
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  update(scroll, direction) {
    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;

    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;
    const B_abs = Math.abs(this.bend);
    const R = (H * H + B_abs * B_abs) / (2 * B_abs);
    const effectiveX = Math.min(Math.abs(x), H);

    if (this.bend > 0) {
      this.plane.position.y = -(R - Math.sqrt(R * R - effectiveX * effectiveX));
      this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
    } else {
      this.plane.position.y = R - Math.sqrt(R * R - effectiveX * effectiveX);
      this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
    }

    // Hover effect scale
    const targetScale = this.hovered ? 1.05 : 1;
    this.plane.scale.x = lerp(
      this.plane.scale.x,
      this.baseScale * targetScale,
      0.1,
    );
    this.plane.scale.y = lerp(
      this.plane.scale.y,
      this.baseScale * targetScale,
      0.1,
    );

    // Infinite scroll
    this.speed = scroll.current - scroll.last;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) this.extra -= this.widthTotal;
    if (direction === "left" && this.isAfter) this.extra += this.widthTotal;
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (!this.screen) this.screen = { width: 900, height: 520 };
    if (viewport) this.viewport = viewport;
    if (!this.viewport)
      this.viewport = { width: this.screen.width, height: this.screen.height };

    this.baseScale = this.screen.height / 1500;
    this.plane.scale.x =
      700 * this.baseScale * (this.viewport.width / this.screen.width);
    this.plane.scale.y =
      900 * this.baseScale * (this.viewport.height / this.screen.height);
    this.widthTotal = this.plane.scale.x * this.length;
    this.x = this.plane.scale.x * this.index;
  }
}

// App class
class App {
  constructor(
    container,
    { items, bend = 3, scrollSpeed = 2, scrollEase = 0.05, autoplay = true },
  ) {
    this.container = container;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.scrollSpeed = scrollSpeed;
    this.autoplay = autoplay;

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      widthSegments: 100,
      heightSegments: 50,
    });
  }

  createMedias(items, bend) {
    const data = items.concat(items);
    this.medias = data.map(
      (project, index) =>
        new Media({
          geometry: this.planeGeometry,
          gl: this.gl,
          project,
          index,
          length: data.length,
          scene: this.scene,
          viewport: this.viewport,
          bend,
        }),
    );

    // Initial resize for all
    this.medias.forEach((m) =>
      m.onResize({ screen: this.screen, viewport: this.viewport }),
    );
  }

  update() {
    if (this.autoplay) this.scroll.target += 0.3;
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease,
    );
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    this.medias.forEach((media) => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = requestAnimationFrame(this.update.bind(this));
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias)
      this.medias.forEach((m) =>
        m.onResize({ screen: this.screen, viewport: this.viewport }),
      );
  }

  addEventListeners() {
    window.addEventListener("resize", () => this.onResize());

    // Touch & mouse
    let isDown = false,
      startX = 0,
      scrollStart = 0;
    const down = (e) => {
      isDown = true;
      scrollStart = this.scroll.current;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
    };
    const move = (e) => {
      if (!isDown) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      this.scroll.target =
        scrollStart + (startX - x) * 0.025 * this.scrollSpeed;
    };
    const up = () => {
      isDown = false;
    };
    window.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchstart", down);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    if (this.renderer.gl.canvas.parentNode)
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
  }
}

// React Component
export default function CircularGallery({
  items,
  bend = 0,
  scrollSpeed = 2,
  scrollEase = 0.05,
  autoplay = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const app = new App(containerRef.current, {
      items,
      bend,
      scrollSpeed,
      scrollEase,
      autoplay,
    });
    return () => app.destroy();
  }, [items, bend, scrollSpeed, scrollEase, autoplay]);

  return (
    <div className="circular-gallery h-[520px] w-full" ref={containerRef}></div>
  );
}
