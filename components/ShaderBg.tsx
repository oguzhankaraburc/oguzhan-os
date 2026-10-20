"use client";

import { useEffect, useRef } from "react";

// Dark fog that drifts and leans toward the cursor. Plain WebGL1, no dependencies.
const frag = `
precision highp float;
uniform vec2 r; uniform float t; uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r; vec2 p=uv*vec2(r.x/r.y,1.)*2.2;
  vec2 mm=m*vec2(r.x/r.y,1.)*2.2;
  float d=length(p-mm);
  vec2 q=vec2(fbm(p+t*.03),fbm(p+vec2(5.2,1.3)-t*.02));
  float f=fbm(p+2.5*q+.6/(d+.6));
  vec3 c=mix(vec3(.01,.012,.02),vec3(.05,.03,.12),f);
  c=mix(c,vec3(.03,.16,.10),smoothstep(.55,.95,f)*.55);
  c+=vec3(.12,.35,.22)*exp(-d*2.2)*.25;
  c*=1.-.55*length(uv-.5);
  c+= (h(gl_FragCoord.xy+t)-.5)*.025;
  gl_FragColor=vec4(c,1.);
}`;

export default function ShaderBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const gl = cv.getContext("webgl");
    if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}"));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(pr);
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uM = gl.getUniformLocation(pr, "m");

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (e: PointerEvent) => { mouse.tx = e.clientX / innerWidth; mouse.ty = 1 - e.clientY / innerHeight; };
    addEventListener("pointermove", onMove);

    // Render at half resolution: it's fog, nobody can tell, and it keeps laptops cool
    const size = () => { cv.width = innerWidth * 0.5; cv.height = innerHeight * 0.5; gl.viewport(0, 0, cv.width, cv.height); };
    size();
    addEventListener("resize", size);

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const loop = (ms: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, ms / 1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", onMove); removeEventListener("resize", size); };
  }, []);

  return <canvas ref={ref} aria-hidden className="fixed inset-0 h-full w-full" />;
}
