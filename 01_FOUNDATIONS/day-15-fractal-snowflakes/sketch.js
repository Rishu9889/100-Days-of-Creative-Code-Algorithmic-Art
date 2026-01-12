  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const depthInput = document.getElementById("depth");
  const generateBtn = document.getElementById("generate");

  let rotation = 0;

  function clear() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
  }

  function drawBranch(len, depth) {
    if (depth === 0) return;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    ctx.save();
    ctx.translate(0, -len);

    const angle = Math.PI / 6 + Math.random() * 0.2;
    const shrink = 0.55 + Math.random() * 0.15;

    ctx.save();
    ctx.rotate(angle);
    drawBranch(len * shrink, depth - 1);
    ctx.restore();

    ctx.save();
    ctx.rotate(-angle);
    drawBranch(len * shrink, depth - 1);
    ctx.restore();

    ctx.restore();
  }

  function drawSnowflake(depth) {
    clear();

    const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 200);
    gradient.addColorStop(0, "#e0f2fe");
    gradient.addColorStop(0.5, "#38bdf8");
    gradient.addColorStop(1, "#0ea5e9");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#38bdf8";

    const arms = 6 + Math.floor(Math.random() * 4);

    ctx.save();
    ctx.rotate(rotation);

    for (let i = 0; i < arms; i++) {
      ctx.save();
      ctx.rotate((Math.PI * 2 / arms) * i);
      drawBranch(90 + Math.random() * 20, depth);
      ctx.restore();
    }

    ctx.restore();
  }

  function generateSnowflake() {
    const depth = Number(depthInput.value);
    drawSnowflake(depth);
  }

  function animate() {
    rotation += 0.002;
    generateSnowflake();
    requestAnimationFrame(animate);
  }

  generateBtn.addEventListener("click", generateSnowflake);
  depthInput.addEventListener("input", generateSnowflake);

  animate();