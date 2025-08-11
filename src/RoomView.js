import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export default function RoomView() {
  const mountRef = useRef(null);
  const canvasMeshRef = useRef(null);
  const canvasGroupRef = useRef(null);
  const roomRefs = useRef({ backWall: null, leftWall: null, rightWall: null, floor: null });
  const [activeWall, setActiveWall] = useState('front'); // 'front' | 'left' | 'right'
  const fileRef = useRef(null);
  const [wallColor, setWallColor] = useState('#ededf5');
  const [floorColor, setFloorColor] = useState('#dad7f0');
  const [mode, setMode] = useState('translate');
  const selectedRef = useRef(null);
  const furnitureRef = useRef([]);
  const tcRef = useRef(null);
  const sceneRef = useRef(null);
  const [canvasScale, setCanvasScale] = useState(1);
  const [selectedScale, setSelectedScale] = useState(1);
  const [selectedPos, setSelectedPos] = useState({ x: 0, y: 0, z: 0 });
  const floorY = -300 + 40; // baseline Y for furniture to sit on floor
  const [nudgeStep, setNudgeStep] = useState(10);
  const [canvasSize, setCanvasSize] = useState('18x24');
  const [selectedColor, setSelectedColor] = useState('#888888');
  const [isDay, setIsDay] = useState(true);
  const ambRef = useRef(null);
  const dirRef = useRef(null);
  const hemiRef = useRef(null);
  // Sidebar resizing
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWRef = useRef(320);

  const canvasPresets = {
    '12x18': { w: 240, h: 360 },
    '18x24': { w: 300, h: 400 },
    '24x36': { w: 360, h: 540 },
    '24x30': { w: 360, h: 450 },
    '20x30': { w: 300, h: 450 }
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f7fb);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000);
    camera.position.set(400, 280, 600);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    mount.appendChild(renderer.domElement);

    const fit = () => {
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(fit); ro.observe(mount); fit();

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.9); scene.add(amb); ambRef.current = amb;
    const hemi = new THREE.HemisphereLight(0xe0f7ff, 0xdedede, 0.35); scene.add(hemi); hemiRef.current = hemi;
    const dir = new THREE.DirectionalLight(0xffffff, 0.7); dir.position.set(500, 600, 300); dir.castShadow = true; scene.add(dir); dirRef.current = dir;
    // Decorative lamp
    const lamp = new THREE.PointLight(0xfff1cc, 0.8, 1500); lamp.position.set(0, 240, 0); scene.add(lamp);

    // Room: floor + three walls (simple box shell)
    const room = new THREE.Group(); scene.add(room);
    const wallMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(wallColor), roughness: 0.95, metalness: 0 });
    const floorMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(floorColor), roughness: 1 });

    const wallW = 1000, wallH = 600, wallD = 1000;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(wallW, wallD), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.y = -wallH/2; floor.receiveShadow = true; room.add(floor);

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(wallW, wallH), wallMat); backWall.position.z = -wallD/2; room.add(backWall);
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(wallD, wallH), wallMat); leftWall.position.x = -wallW/2; leftWall.rotation.y = Math.PI/2; room.add(leftWall);
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(wallD, wallH), wallMat); rightWall.position.x = wallW/2; rightWall.rotation.y = -Math.PI/2; room.add(rightWall);
    roomRefs.current = { backWall, leftWall, rightWall, floor };

    // Canvas (thin box) centered on back wall
    const canvasGroup = new THREE.Group(); scene.add(canvasGroup); canvasGroupRef.current = canvasGroup;
    const cW = 300, cH = 400, cT = 20;
    const tex = new THREE.TextureLoader().load(''); // empty to start
    const front = new THREE.MeshBasicMaterial({ map: tex, color: 0xffffff });
    const sideCommon = { color: 0x8b5e3c, roughness: 0.8 };
    const materials = [
      new THREE.MeshStandardMaterial(sideCommon), // +x
      new THREE.MeshStandardMaterial(sideCommon), // -x
      new THREE.MeshStandardMaterial(sideCommon), // +y
      new THREE.MeshStandardMaterial(sideCommon), // -y
      front,                                       // +z
      new THREE.MeshStandardMaterial(sideCommon), // -z
    ];
    const canvasMesh = new THREE.Mesh(new THREE.BoxGeometry(cW, cH, cT), materials);
    canvasMesh.castShadow = true; canvasMeshRef.current = canvasMesh; canvasGroup.add(canvasMesh);

    const placeOnWall = (wall) => {
      canvasGroup.position.set(0, 0, 0);
      canvasGroup.rotation.set(0, 0, 0);
      if (wall === 'front') {
        canvasGroup.position.set(0, 0, -wallD/2 + cT/2 + 1);
        canvasGroup.rotation.y = 0;
      } else if (wall === 'left') {
        canvasGroup.position.set(-wallW/2 + cT/2 + 1, 0, 0);
        canvasGroup.rotation.y = Math.PI/2;
      } else if (wall === 'right') {
        canvasGroup.position.set(wallW/2 - cT/2 - 1, 0, 0);
        canvasGroup.rotation.y = -Math.PI/2;
      }
      setActiveWall(wall);
    };
    placeOnWall('front');
    // apply initial size preset
    const preset = canvasPresets[canvasSize];
    if (preset) {
      const sx = preset.w / cW; const sy = preset.h / cH;
      canvasMesh.scale.set(sx, sy, 1);
    }

    // Controls
    const orbit = new OrbitControls(camera, renderer.domElement); orbit.enableDamping = true; orbit.target.set(0, 0, 0);
    const tcontrols = new TransformControls(camera, renderer.domElement); tcRef.current = tcontrols;
    tcontrols.attach(canvasMesh);
    tcontrols.setMode(mode);
    tcontrols.showZ = false; // constrain to X/Y on wall plane visually
    tcontrols.addEventListener('dragging-changed', (e)=> { orbit.enabled = !e.value; });
    scene.add(tcontrols);

    // Selection via raycasting
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onPointer = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const selectable = [canvasGroup, ...furnitureRef.current];
      const meshes = [];
      selectable.forEach((g) => g.traverse((o)=> { if (o.isMesh) meshes.push(o); }));
      const hit = raycaster.intersectObjects(meshes, true)[0];
      if (hit) {
        // find top-level group
        let obj = hit.object;
        while (obj.parent && !selectable.includes(obj)) obj = obj.parent;
        selectedRef.current = obj;
        tcontrols.attach(obj);
        setSelectedScale(obj.scale.x);
        setSelectedPos({ x: obj.position.x, y: obj.position.y, z: obj.position.z });
        // initialize color UI from first mesh
        let color = '#888888';
        obj.traverse((o)=>{ if (o.isMesh && o.material && o.material.color) { color = `#${o.material.color.getHexString()}`; } });
        setSelectedColor(color);
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointer);

    // Keep furniture constrained to the floor while translating
    const onObjectChange = () => {
      const obj = selectedRef.current; if (!obj) return;
      const isCanvas = obj === canvasGroup;
      if (!isCanvas) {
        obj.position.y = floorY;
      }
      setSelectedPos({ x: obj.position.x, y: obj.position.y, z: obj.position.z });
    };
    tcontrols.addEventListener('objectChange', onObjectChange);

    const animate = () => { requestAnimationFrame(animate); orbit.update(); renderer.render(scene, camera); };
    animate();

    return () => {
      try { ro.disconnect(); } catch(_){}
      renderer.domElement.removeEventListener('pointerdown', onPointer);
      tcontrols.removeEventListener('objectChange', onObjectChange);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  // Update colors when state changes
  useEffect(() => {
    const { backWall, leftWall, rightWall } = roomRefs.current || {};
    if (backWall) { backWall.material.color.set(wallColor); backWall.material.needsUpdate = true; }
    if (leftWall) { leftWall.material.color.set(wallColor); leftWall.material.needsUpdate = true; }
    if (rightWall) { rightWall.material.color.set(wallColor); rightWall.material.needsUpdate = true; }
  }, [wallColor]);
  useEffect(() => {
    const { floor } = roomRefs.current || {};
    if (floor) { floor.material.color.set(floorColor); floor.material.needsUpdate = true; }
  }, [floorColor]);

  const handleUpload = (e) => {
    const file = e.target.files[0]; if (!file || !canvasMeshRef.current) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const tex = new THREE.TextureLoader();
      tex.crossOrigin = 'anonymous';
      tex.load(ev.target.result, (t) => {
        t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
        const mesh = canvasMeshRef.current;
        mesh.material[4].map = t; // front face
        mesh.material[4].needsUpdate = true;
      });
    };
    reader.readAsDataURL(file);
  };

  // Add simple furniture placeholders
  const addFurniture = (type) => {
    const mount = mountRef.current; if (!mount) return;
    // Find renderer/camera/scene via DOM traversal is cumbersome; instead keep minimal by adding to three objects attached earlier
    // We stored nothing; so reusing canvasMeshRef scene parent
    const mesh = canvasMeshRef.current; if (!mesh) return;
    const scene = sceneRef.current || mesh.parent?.parent; // canvasGroup -> scene
    if (!scene) return;

    const group = new THREE.Group();
    group.position.set(0, -300 + 40, 100); // on floor roughly
    let body;
    if (type === 'sofa') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(220, 60, 90), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 }));
      const back = new THREE.Mesh(new THREE.BoxGeometry(220, 70, 20), new THREE.MeshStandardMaterial({ color: 0x777777 })); back.position.set(0, 35, -35);
      const armL = new THREE.Mesh(new THREE.BoxGeometry(20, 60, 90), new THREE.MeshStandardMaterial({ color: 0x777777 })); armL.position.set(-120, 0, 0);
      const armR = armL.clone(); armR.position.x = 120;
      group.add(base, back, armL, armR);
    } else if (type === 'bed') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(260, 40, 160), new THREE.MeshStandardMaterial({ color: 0xc9b8a8 }));
      const head = new THREE.Mesh(new THREE.BoxGeometry(260, 80, 20), new THREE.MeshStandardMaterial({ color: 0xb49a86 })); head.position.set(0, 40, -70);
      group.add(base, head);
    } else {
      const table = new THREE.Mesh(new THREE.BoxGeometry(120, 12, 70), new THREE.MeshStandardMaterial({ color: 0x996633 }));
      const leg = new THREE.Mesh(new THREE.BoxGeometry(8, 60, 8), new THREE.MeshStandardMaterial({ color: 0x664422 }));
      const legs = [leg.clone(), leg.clone(), leg.clone(), leg.clone()];
      legs[0].position.set(-55, -36, -30); legs[1].position.set(55, -36, -30); legs[2].position.set(-55, -36, 30); legs[3].position.set(55, -36, 30);
      group.add(table, ...legs);
    }
    group.traverse((m) => { m.castShadow = true; m.receiveShadow = true; });
    scene.add(group);
    furnitureRef.current.push(group);

    // Attach transform controls to new item if available
    const tc = tcRef.current;
    if (tc) { tc.attach(group); }
  };

  const setTransformMode = (m) => {
    setMode(m);
    // update existing control
    const tc = tcRef.current;
    if (tc) tc.setMode(m);
  };

  const snapCanvasTo = (wall) => {
    const group = canvasGroupRef.current; if (!group) return;
    // reuse logic: mimic initial placement math
    const wallW = 1000, wallH = 600, wallD = 1000, cT = 20;
    if (wall === 'front') { group.position.set(0, 0, -wallD/2 + cT/2 + 1); group.rotation.y = 0; }
    if (wall === 'left')  { group.position.set(-1000/2 + cT/2 + 1, 0, 0); group.rotation.y = Math.PI/2; }
    if (wall === 'right') { group.position.set( 1000/2 - cT/2 - 1, 0, 0); group.rotation.y = -Math.PI/2; }
    setActiveWall(wall);
    const tc = tcRef.current; if (tc) tc.attach(group);
    selectedRef.current = group; setSelectedPos({ x: group.position.x, y: group.position.y, z: group.position.z });
  };

  // Arrow keys to nudge selection
  useEffect(() => {
    const onKey = (e) => {
      const obj = selectedRef.current; if (!obj) return;
      const step = e.shiftKey ? 10 : 5;
      let moved = false;
      if (e.key === 'ArrowLeft') { obj.position.x -= step; moved = true; }
      if (e.key === 'ArrowRight'){ obj.position.x += step; moved = true; }
      if (e.key === 'ArrowUp')  { obj.position.z -= step; moved = true; }
      if (e.key === 'ArrowDown'){ obj.position.z += step; moved = true; }
      if (moved) { e.preventDefault(); setSelectedPos({ x: obj.position.x, y: obj.position.y, z: obj.position.z }); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const applySelectedPos = (axis, value) => {
    const obj = selectedRef.current; if (!obj) return;
    obj.position[axis] = value;
    if (obj !== canvasGroupRef.current) obj.position.y = floorY;
    setSelectedPos({ x: obj.position.x, y: obj.position.y, z: obj.position.z });
  };

  const nudge = (dx=0, dz=0) => {
    const obj = selectedRef.current; if (!obj) return;
    obj.position.x += dx * nudgeStep;
    obj.position.z += dz * nudgeStep;
    if (obj !== canvasGroupRef.current) obj.position.y = floorY;
    setSelectedPos({ x: obj.position.x, y: obj.position.y, z: obj.position.z });
  };

  const rotateSelected = (deg) => {
    const obj = selectedRef.current; if (!obj) return;
    obj.rotation.y += (deg * Math.PI) / 180;
  };

  const applyCanvasPreset = (key) => {
    const mesh = canvasMeshRef.current; if (!mesh) return;
    const baseW = 300, baseH = 400; // cW/cH
    const preset = canvasPresets[key]; if (!preset) return;
    const sx = preset.w / baseW; const sy = preset.h / baseH;
    mesh.scale.set(sx, sy, 1);
    setCanvasSize(key);
  };

  const recolorSelected = (hex) => {
    const obj = selectedRef.current; if (!obj) return;
    obj.traverse((m)=> { if (m.isMesh && m.material && m.material.color) { m.material.color.set(hex); m.material.needsUpdate = true; } });
    setSelectedColor(hex);
  };

  const addPlant = () => {
    const scene = sceneRef.current; if (!scene) return;
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(30, 36, 40, 24), new THREE.MeshStandardMaterial({ color: 0x8d6e63 }));
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 80, 12), new THREE.MeshStandardMaterial({ color: 0x5d4037 })); stem.position.y = 60;
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(60, 120, 24), new THREE.MeshStandardMaterial({ color: 0x4caf50 })); leaves.position.y = 140;
    const plant = new THREE.Group(); plant.add(pot, stem, leaves); plant.position.set(200, floorY, 120);
    scene.add(plant); furnitureRef.current.push(plant);
    const tc = tcRef.current; if (tc) tc.attach(plant); selectedRef.current = plant; setSelectedScale(1); setSelectedPos({ x: plant.position.x, y: plant.position.y, z: plant.position.z });
  };

  const addRug = () => {
    const scene = sceneRef.current; if (!scene) return;
    const texCanvas = document.createElement('canvas'); texCanvas.width = 256; texCanvas.height = 256; const ctx = texCanvas.getContext('2d');
    const grd = ctx.createRadialGradient(128,128,10,128,128,120); grd.addColorStop(0,'#b39ddb'); grd.addColorStop(1,'#7e57c2'); ctx.fillStyle = grd; ctx.fillRect(0,0,256,256);
    const tex = new THREE.CanvasTexture(texCanvas); tex.colorSpace = THREE.SRGBColorSpace; tex.needsUpdate = true;
    const rug = new THREE.Mesh(new THREE.CircleGeometry(120, 48), new THREE.MeshStandardMaterial({ map: tex })); rug.rotation.x = -Math.PI/2; rug.position.set(-180, floorY-0.1, 40);
    rug.receiveShadow = true; scene.add(rug); furnitureRef.current.push(rug);
    const tc = tcRef.current; if (tc) tc.attach(rug); selectedRef.current = rug; setSelectedScale(1); setSelectedPos({ x: rug.position.x, y: rug.position.y, z: rug.position.z });
  };

  // Day/Night lighting toggle
  useEffect(() => {
    const amb = ambRef.current, dir = dirRef.current, hemi = hemiRef.current;
    if (!amb || !dir || !hemi) return;
    if (isDay) {
      amb.intensity = 0.9; hemi.intensity = 0.35; dir.intensity = 0.7; sceneRef.current.background = new THREE.Color(0xf6f7fb);
    } else {
      amb.intensity = 0.3; hemi.intensity = 0.1; dir.intensity = 0.25; sceneRef.current.background = new THREE.Color(0x0f0f14);
    }
  }, [isDay]);

  const removeSelected = () => {
    const obj = selectedRef.current; if (!obj) return;
    // don't remove canvas group
    if (obj === canvasGroupRef.current) return;
    const scene = sceneRef.current; if (!scene) return;
    scene.remove(obj);
    furnitureRef.current = furnitureRef.current.filter((g) => g !== obj);
    selectedRef.current = null;
    const tc = tcRef.current; if (tc) tc.detach();
  };

  return (
    <div className="room-root" style={{ width: '100vw', height: 'calc(100vh - 80px)', position: 'relative' }}>
      {/* Sidebar controls (left-aligned, avoid header overlap by offsetting from left) */}
      <div className="room-sidebar" style={{ position:'absolute', left:12, top:76, bottom:12, width: Math.min(window.innerWidth * 0.92, sidebarWidth), display:'flex', flexDirection:'column', gap:12, padding:14, background:'rgba(255,255,255,0.95)', borderRadius:16, boxShadow:'0 16px 40px rgba(0,0,0,0.12)', overflow:'auto', zIndex:10 }}>
        {/* Resize handle */}
        <div
          onMouseDown={(e)=>{ resizingRef.current = true; startXRef.current = e.clientX; startWRef.current = sidebarWidth; const onMove = (ev)=>{ if (!resizingRef.current) return; const dx = ev.clientX - startXRef.current; const target = Math.max(260, Math.min(startWRef.current + dx, Math.min(window.innerWidth - 140, 520))); setSidebarWidth(target); }; const onUp = ()=>{ resizingRef.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }; window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp); }}
          style={{ position:'absolute', right:-6, top:0, bottom:0, width:12, cursor:'col-resize', borderRadius:6 }}
          title="Drag to resize sidebar"
        />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          <button className={`room-btn ${activeWall==='front'?'active':''}`} onClick={()=> snapCanvasTo('front')} title="Front Wall">F</button>
          <button className={`room-btn ${activeWall==='left'?'active':''}`} onClick={()=> snapCanvasTo('left')} title="Left Wall">L</button>
          <button className={`room-btn ${activeWall==='right'?'active':''}`} onClick={()=> snapCanvasTo('right')} title="Right Wall">R</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          <button className="room-btn" onClick={()=> setTransformMode('translate')} title="Move">↔</button>
          <button className="room-btn" onClick={()=> setTransformMode('rotate')} title="Rotate">⟲</button>
          <button className="room-btn" onClick={()=> setTransformMode('scale')} title="Scale">⤢</button>
        </div>
        {/* Nudge pad & rotation */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr minmax(120px, 160px) 1fr', gap:8, alignItems:'center' }}>
          <div style={{ display:'grid', gap:4 }}>
            <label style={{ fontWeight:700 }}>Nudge</label>
            <div style={{ display:'grid', gridTemplateColumns:'40px 40px 40px', gridTemplateRows:'40px 40px 40px', gap:4, justifyContent:'center' }}>
              <span></span>
              <button className="room-btn" onClick={()=> nudge(0,-1)}>▲</button>
              <span></span>
              <button className="room-btn" onClick={()=> nudge(-1,0)}>◀</button>
              <button className="room-btn" onClick={()=> nudge(0,0)} title="Center (no-op)">•</button>
              <button className="room-btn" onClick={()=> nudge(1,0)}>▶</button>
              <span></span>
              <button className="room-btn" onClick={()=> nudge(0,1)}>▼</button>
              <span></span>
            </div>
          </div>
          <div style={{ display:'grid', gap:4 }}>
            <label style={{ fontWeight:700 }}>Step</label>
            <input type="range" min="1" max="50" step="1" value={nudgeStep} onChange={(e)=> setNudgeStep(parseInt(e.target.value))} />
          </div>
          <div style={{ display:'grid', gap:4 }}>
            <label style={{ fontWeight:700 }}>Rotate</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              <button className="room-btn" onClick={()=> rotateSelected(-5)}>⟲ -5°</button>
              <button className="room-btn" onClick={()=> rotateSelected(+5)}>⟳ +5°</button>
            </div>
          </div>
        </div>
        <div className="room-color" style={{ display:'grid', gridTemplateColumns:'auto 1fr', alignItems:'center', gap:8, minWidth:0 }}>
          <span>Wall</span>
          <input type="color" value={wallColor} onChange={(e)=> setWallColor(e.target.value)} />
        </div>
        <div className="room-color" style={{ display:'grid', gridTemplateColumns:'auto 1fr', alignItems:'center', gap:8, minWidth:0 }}>
          <span>Floor</span>
          <input type="color" value={floorColor} onChange={(e)=> setFloorColor(e.target.value)} />
        </div>
        <hr style={{ border:'none', height:1, background:'#eee' }} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          <button className="room-btn" onClick={()=> addFurniture('sofa')}>Sofa</button>
          <button className="room-btn" onClick={()=> addFurniture('bed')}>Bed</button>
          <button className="room-btn" onClick={()=> addFurniture('table')}>Table</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <button className="room-btn" onClick={addPlant}>Plant</button>
          <button className="room-btn" onClick={addRug}>Rug</button>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button className="room-btn" onClick={removeSelected}>🗑 Remove Selected</button>
          <button className="room-btn" onClick={()=> { const cam = sceneRef.current ? sceneRef.current.children.find(c=>c.isCamera) : null; if (!cam) return; cam.position.set(600, 380, 600); }}>🎥 Corner</button>
        </div>
        <button className="room-btn" onClick={()=> { selectedRef.current = canvasGroupRef.current; const tc = tcRef.current; if (tc) tc.attach(canvasGroupRef.current); setSelectedScale(canvasGroupRef.current.scale.x); setSelectedPos({ x: canvasGroupRef.current.position.x, y: canvasGroupRef.current.position.y, z: canvasGroupRef.current.position.z }); }}>Select Canvas</button>
        <button className="room-btn" onClick={()=> fileRef.current?.click()}>Upload Canvas Image</button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontWeight:700 }}>Canvas Preset</label>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
            {Object.keys(canvasPresets).map(key => (
              <button key={key} className={`room-btn ${canvasSize===key?'active':''}`} onClick={()=> applyCanvasPreset(key)}>{key.replace('x','×')}</button>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontWeight:700 }}>Canvas Scale</label>
          <input type="range" min="0.5" max="2" step="0.05" value={canvasScale} onChange={(e)=> { const s=parseFloat(e.target.value); setCanvasScale(s); const g=canvasGroupRef.current; if (g) g.scale.setScalar(s); }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontWeight:700 }}>Selected Scale</label>
          <input type="range" min="0.3" max="3" step="0.05" value={selectedScale} onChange={(e)=> { const s=parseFloat(e.target.value); setSelectedScale(s); const obj=selectedRef.current; if (obj) obj.scale.setScalar(s); }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <label style={{ fontWeight:700 }}>X</label>
            <input type="number" value={selectedPos.x} onChange={(e)=> applySelectedPos('x', parseFloat(e.target.value||0))} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <label style={{ fontWeight:700 }}>Y</label>
            <input type="number" value={selectedPos.y} onChange={(e)=> applySelectedPos('y', parseFloat(e.target.value||0))} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <label style={{ fontWeight:700 }}>Z</label>
            <input type="number" value={selectedPos.z} onChange={(e)=> applySelectedPos('z', parseFloat(e.target.value||0))} />
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontWeight:700 }}>Selected Color</label>
          <input type="color" value={selectedColor} onChange={(e)=> recolorSelected(e.target.value)} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <button className="room-btn" onClick={()=> setIsDay(true)}>Day</button>
          <button className="room-btn" onClick={()=> setIsDay(false)}>Night</button>
        </div>
        <button className="room-btn" onClick={removeSelected}>Remove Selected</button>
      </div>
      <div ref={mountRef} className="room-canvas" style={{ width: '100%', height: '100%', background: '#f8f9ff' }} />
    </div>
  );
}

