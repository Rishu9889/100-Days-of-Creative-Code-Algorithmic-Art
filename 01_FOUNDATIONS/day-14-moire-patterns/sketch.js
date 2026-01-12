    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d");
    const densityInput = document.getElementById("density");
    const resetBtn = document.getElementById("reset");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    let angleA = 0;
    let angleB = Math.PI / 6;
    let offset = 0;
    let speed = 0.003;

    function clear() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
    }

    function drawLineField(spacing, angle, color, alpha) {
      ctx.save();
      ctx.rotate(angle);
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1;

      const size = Math.max(canvas.width, canvas.height);
      for (let i = -size; i <= size; i += spacing) {
        ctx.beginPath();
        ctx.moveTo(i, -size);
        ctx.lineTo(i, size);
        ctx.stroke();
      }

      ctx.restore();
    }

    function draw() {
      clear();

      const spacing = Number(densityInput.value);

      drawLineField(spacing, angleA, "#38bdf8", 0.8);

      ctx.save();
      ctx.translate(Math.sin(offset) * 10, Math.cos(offset) * 10);
      drawLineField(spacing, angleB, "#e0f2fe", 0.8);
      ctx.restore();

      angleA += speed;
      angleB -= speed * 0.8;
      offset += 0.01;

      requestAnimationFrame(draw);
    }

    function resetPattern() {
      angleA = Math.random() * Math.PI;
      angleB = Math.random() * Math.PI;
      speed = 0.001 + Math.random() * 0.005;
    }

    resetBtn.addEventListener("click", resetPattern);

    draw();