import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Simple WebGL preview of a wrapped canvas frame using Three.js
// - Front face: uploaded image
// - Side faces: narrow slices of the image to simulate wrap
// - Back face: wooden color with staple meshes around the perimeter
export default function ThreeCanvasPreview({
  imageSrc,
  width = 300,
  height = 400,
  depth = 20,
  rotationY = 0,
  showBack = false,
  collageSlots = null,
  collageStates = null,
}) {
  const containerRef = useRef(null);
  const groupRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f7fb);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 5000);
    camera.position.set(0, height * 0.6, Math.max(width, height) * 2.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    const initW = container.clientWidth || 640;
    const initH = container.clientHeight || 520;
    renderer.setSize(initW, initH);
    // Ensure correct color output (avoid dark/washed textures)
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(200, 300, 200);
    dir.castShadow = true;
    scene.add(dir);

    // Group to hold the canvas and all adornments
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    const loader = new THREE.TextureLoader();
    try { loader.setCrossOrigin && loader.setCrossOrigin('anonymous'); } catch (_) {}
    loader.crossOrigin = 'anonymous';

    const setupWithTexture = (tx) => {
      tx.colorSpace = THREE.SRGBColorSpace;

      // Materials
      const frontMat = new THREE.MeshBasicMaterial({ map: tx });

      const leftSlice = tx.clone(); leftSlice.needsUpdate = true; leftSlice.wrapS = THREE.RepeatWrapping; leftSlice.wrapT = THREE.RepeatWrapping; leftSlice.repeat.set(0.05, 1); leftSlice.offset.set(0.0, 0);
      const rightSlice = tx.clone(); rightSlice.needsUpdate = true; rightSlice.wrapS = THREE.RepeatWrapping; rightSlice.wrapT = THREE.RepeatWrapping; rightSlice.repeat.set(0.05, 1); rightSlice.offset.set(0.95, 0);
      const topSlice = tx.clone(); topSlice.needsUpdate = true; topSlice.wrapS = THREE.RepeatWrapping; topSlice.wrapT = THREE.RepeatWrapping; topSlice.repeat.set(1, 0.05); topSlice.offset.set(0, 0.95);
      const bottomSlice = tx.clone(); bottomSlice.needsUpdate = true; bottomSlice.wrapS = THREE.RepeatWrapping; bottomSlice.wrapT = THREE.RepeatWrapping; bottomSlice.repeat.set(1, 0.05); bottomSlice.offset.set(0, 0.0);

      const commonSide = { roughness: 0.6, metalness: 0.0 };
      const sideMatV = new THREE.MeshStandardMaterial({ map: leftSlice, ...commonSide });
      const sideMatVRight = new THREE.MeshStandardMaterial({ map: rightSlice, ...commonSide });
      const sideMatHTop = new THREE.MeshStandardMaterial({ map: topSlice, ...commonSide });
      const sideMatHBottom = new THREE.MeshStandardMaterial({ map: bottomSlice, ...commonSide });

      const backMat = new THREE.MeshStandardMaterial({ color: 0x8b5e3c, roughness: 0.8, metalness: 0.0 });

      const w = width; const h = height; const d = depth;
      const geom = new THREE.BoxGeometry(w, h, d);
      const materials = [
        sideMatVRight,
        sideMatV,
        sideMatHTop,
        sideMatHBottom,
        frontMat,
        backMat
      ];
      const box = new THREE.Mesh(geom, materials);
      box.castShadow = true;
      box.receiveShadow = true;
      group.add(box);

      const stapleMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.6, roughness: 0.3 });
      const stapleGeomH = new THREE.BoxGeometry(w * 0.06, d * 0.25, d * 0.1);
      const stapleGeomV = new THREE.BoxGeometry(d * 0.25, h * 0.06, d * 0.1);
      const addStaple = (x, y, horizontal) => {
        const mesh = new THREE.Mesh(horizontal ? stapleGeomH : stapleGeomV, stapleMat);
        mesh.position.set(x, y, -d / 2 - (d * 0.05));
        group.add(mesh);
      };
      const xs = [-w * 0.3, -w * 0.1, w * 0.1, w * 0.3];
      const ys = [-h * 0.3, -h * 0.1, h * 0.1, h * 0.3];
      xs.forEach((x) => addStaple(x, h / 2 + d * 0.15, true));
      xs.forEach((x) => addStaple(x, -h / 2 - d * 0.15, true));
      ys.forEach((y) => addStaple(-w / 2 - d * 0.15, y, false));
      ys.forEach((y) => addStaple(w / 2 + d * 0.15, y, false));

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 4, h * 4),
        new THREE.ShadowMaterial({ opacity: 0.15 })
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -h / 2 - 10;
      plane.receiveShadow = true;
      scene.add(plane);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.target.set(0, 0, 0);
      controlsRef.current = controls;

      const onResize = () => {
        if (!container) return;
        const { clientWidth, clientHeight } = container;
        const w2 = Math.max(1, clientWidth);
        const h2 = Math.max(1, clientHeight);
        renderer.setSize(w2, h2);
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);
      const ro = new ResizeObserver(onResize);
      ro.observe(container);
      onResize();

      const animate = () => {
        requestAnimationFrame(animate);
        const desiredY = (showBack ? Math.PI : 0) + THREE.MathUtils.degToRad(rotationY);
        group.rotation.y += (desiredY - group.rotation.y) * 0.15;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener('resize', onResize);
        try { ro.disconnect(); } catch (e) {}
        controls.dispose();
        geom.dispose();
        materials.forEach((m) => m.dispose());
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    };

    const buildCollageTexture = async () => {
      const canvas = document.createElement('canvas');
      const canvasW = Math.max(256, Math.round(width * 2));
      const canvasH = Math.max(256, Math.round(height * 2));
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasW, canvasH);

      const toPx = (p, total) => (p / 100) * total;
      const load = (src) => new Promise((resolve) => {
        if (!src) return resolve(null);
        const im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload = () => resolve(im);
        im.onerror = () => resolve(null);
        im.src = src;
      });
      const imgs = await Promise.all(collageSlots.map((_, i) => load(collageStates?.[i]?.src)));

      collageSlots.forEach((slot, i) => {
        const rectX = toPx(slot.x, canvasW);
        const rectY = toPx(slot.y, canvasH);
        const rectW = toPx(slot.w, canvasW);
        const rectH = toPx(slot.h, canvasH);
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(rectX, rectY, rectW, rectH);
        const img = imgs[i];
        if (!img) return;
        const st = collageStates?.[i] || {};
        const pos = st.pos || { x: 0, y: 0 };
        const userScale = st.scale || 1;
        const rot = (st.rot || 0) * Math.PI / 180;

        const imgRatio = img.width / img.height;
        const slotRatio = rectW / rectH;
        let drawW, drawH;
        if (imgRatio > slotRatio) { drawW = rectW; drawH = rectW / imgRatio; }
        else { drawH = rectH; drawW = rectH * imgRatio; }
        drawW *= userScale; drawH *= userScale;

        const cx = rectX + rectW / 2;
        const cy = rectY + rectH / 2;
        ctx.save();
        ctx.translate(cx, cy);
        if (rot) ctx.rotate(rot);
        ctx.drawImage(img, -drawW/2 + pos.x, -drawH/2 + pos.y, drawW, drawH);
        ctx.restore();
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
    };

    (async () => {
      let cleanup = null;
      if (collageSlots && collageStates) {
        const tx = await buildCollageTexture();
        cleanup = setupWithTexture(tx);
      } else {
        loader.load(imageSrc, (tx) => { cleanup = setupWithTexture(tx); });
      }

      // Attach cleanup when effect finishes
      // eslint-disable-next-line consistent-return
      return cleanup;
    })();

    // eslint-disable-next-line consistent-return
    return () => {
      if (rendererRef.current && rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
      }
    };
  }, [imageSrc, width, height, depth, rotationY, showBack, collageSlots, collageStates]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', borderRadius: 16, overflow: 'visible' }} />
  );
}

