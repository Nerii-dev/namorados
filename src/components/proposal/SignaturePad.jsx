import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const INK = '#3a2f6b';

// Campo de assinatura com o dedo/mouse. Expõe clear() e o canvas via ref.
const SignaturePad = forwardRef(function SignaturePad({ disabled, onInk }, ref) {
  const canvasRef = useRef(null);
  const drawing = useRef(null);

  useImperativeHandle(ref, () => ({
    get canvas() {
      return canvasRef.current;
    },
    clear() {
      const canvas = canvasRef.current;
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = INK;
  }, []);

  const pointFrom = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const start = (event) => {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFrom(event);
    drawing.current = { last: point, mid: point };
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.arc(point.x, point.y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = INK;
    ctx.fill();
    onInk();
  };

  const move = (event) => {
    if (!drawing.current) return;
    const point = pointFrom(event);
    const { last, mid } = drawing.current;
    const nextMid = { x: (last.x + point.x) / 2, y: (last.y + point.y) / 2 };
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(mid.x, mid.y);
    ctx.quadraticCurveTo(last.x, last.y, nextMid.x, nextMid.y);
    ctx.stroke();
    drawing.current = { last: point, mid: nextMid };
  };

  const end = () => {
    drawing.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`h-28 w-full touch-none ${disabled ? '' : 'cursor-crosshair'}`}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="Campo de assinatura"
    />
  );
});

export default SignaturePad;
