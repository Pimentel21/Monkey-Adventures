window.onload = function() {
    const canvas = document.getElementById('fundo');
    const ctx = canvas.getContext('2d');

    // Ajusta o tamanho do canvas para preencher a tela
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fundo = new Image();
    fundo.src = 'img/fundo.png';

    const macaco = new Image();
    macaco.src = 'img/macaco.png';
    const puloMacaco = new Image(); // Nova imagem para o pulo do macaco
    puloMacaco.src = 'img/pulo.png'; // Imagem do pulo do macaco
    let macacoWidth = 80; // Largura do macaco
    let macacoHeight = 80; // Altura do macaco
    const macacoX = 100; // Posição X do macaco
    let macacoY = canvas.height - macacoHeight; // Posição inicial do macaco na parte inferior do canvas
    let macacoVelY = 0; // Velocidade vertical do macaco
    const gravidade = 0.5; // Gravidade que afeta o macaco
    const impulso = -20; // Impulso do pulo do macaco
    let jogoAtivo = true; // Estado do jogo (ativo ou não)

    const espinho = new Image();
    espinho.src = 'img/espinho1.png';
    const espinho2 = new Image(); // Novo obstáculo
    espinho2.src = 'img/espinho2.png'; // Imagem do novo obstáculo
    const obstaculoWidth = 50; // Largura dos obstáculos
    const obstaculoHeight = 50; // Altura dos obstáculos
    let obstaculoSpeed = 3; // Velocidade inicial dos obstáculos

    const obstaculos = [];

    const somMorte = new Audio('sfx/sommorte.mp3'); // Som de morte

    let score = 0; // Pontuação inicial
    const scoreElement = document.createElement('div'); // Elemento HTML para exibir a pontuação
    scoreElement.style.position = 'absolute';
    scoreElement.style.top = '10px';
    scoreElement.style.left = '10px';
    scoreElement.style.color = 'white';
    scoreElement.style.fontSize = '24px';
    document.body.appendChild(scoreElement);

    function desenharFundo() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenha o fundo
        ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);

        // Aplica a gravidade e a velocidade do pulo
        macacoVelY += gravidade;
        macacoY += macacoVelY;

        // Impede que o macaco caia abaixo do chão
        if (macacoY > canvas.height - macacoHeight) {
            macacoY = canvas.height - macacoHeight;
            macacoVelY = 0;
        }

        // Desenha o macaco
        if (macacoVelY !== 0) {
            // Se o macaco estiver pulando, desenha a imagem do pulo
            ctx.drawImage(puloMacaco, macacoX, macacoY, macacoWidth, macacoHeight);
        } else {
            // Se o macaco não estiver pulando, desenha a imagem do macaco normal
            ctx.drawImage(macaco, macacoX, macacoY, macacoWidth, macacoHeight);
        }

        // Move e desenha os obstáculos
        for (let i = 0; i < obstaculos.length; i++) {
            if (obstaculos[i].tipo === "espinho1") {
                ctx.drawImage(espinho, obstaculos[i].x, canvas.height - obstaculoHeight, obstaculoWidth, obstaculoHeight);
            } else if (obstaculos[i].tipo === "espinho2") { // Desenha o novo obstáculo
                ctx.drawImage(espinho2, obstaculos[i].x, canvas.height - obstaculoHeight, obstaculoWidth, obstaculoHeight);
            }

            // Ajusta a hitbox dos espinhos
            const hitboxWidth = obstaculoWidth * 0.5; // Ajusta a largura da hitbox
            const hitboxHeight = obstaculoHeight * 0.5; // Ajusta a altura da hitbox
            const hitboxX = obstaculos[i].x + (obstaculoWidth - hitboxWidth) / 2; // Centraliza a hitbox horizontalmente
            const hitboxY = canvas.height - obstaculoHeight + (obstaculoHeight - hitboxHeight) / 2; // Centraliza a hitbox verticalmente

            // Verifica colisão
            if (hitboxX < macacoX + macacoWidth && 
                hitboxX + hitboxWidth > macacoX &&
                hitboxY < macacoY + macacoHeight &&
                hitboxY + hitboxHeight > macacoY) {
                jogoAtivo = false;
                somMorte.play(); // Reproduz o som de morte
                alert(`O MACACO MORREU 😭\nPontuação: ${Math.floor(score)}`);
                window.location.href = 'menu.html'; // Redireciona para o menu
                return;
            }

            // Move o obstáculo para a esquerda
            obstaculos[i].x -= obstaculoSpeed;

            // Remove os obstáculos que saíram do canvas
            if (obstaculos[i].x + obstaculoWidth < 0) {
                obstaculos.splice(i, 1);
            }
        }

        if (jogoAtivo) {
            // Atualiza a pontuação com base na distância percorrida
            score += obstaculoSpeed * 0.1;
            scoreElement.innerText = `Pontuação: ${Math.floor(score)}`;

            // Aumenta a velocidade dos obstáculos a cada 100 pontos
            if (Math.floor(score) % 100 === 0) {
                obstaculoSpeed += 0.5;
            }
            
            requestAnimationFrame(desenharFundo);
        }
    }

    // Função para adicionar obstáculos
    function adicionarObstaculo() {
        const tiposObstaculos = ["espinho1", "espinho2"]; // Tipos de obstáculos
        const tipoAleatorio = tiposObstaculos[Math.floor(Math.random() * tiposObstaculos.length)]; // Escolhe aleatoriamente entre os tipos de obstáculos
        obstaculos.push({ x: canvas.width, tipo: tipoAleatorio }); // Adiciona o novo obstáculo com um tipo aleatório
        // Define o próximo intervalo aleatório para adicionar obstáculos
    const intervaloMinimo = 100; // Distância mínima entre a adição de obstáculos
    const intervaloMaximo = 1500; // Distância máxima entre a adição de obstáculos
    const intervaloAleatorio = Math.random() * (intervaloMaximo - intervaloMinimo) + intervaloMinimo;
    setTimeout(adicionarObstaculo, intervaloAleatorio);
}

// Listener para a tecla de espaço para o macaco pular
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && macacoY === canvas.height - macacoHeight) {
        macacoVelY = impulso; // Aplica um impulso para o pulo
        // Altera as dimensões do macaco para o pulo
        macacoWidth = 80;
        macacoHeight = 80;
        const somPulo = new Audio('sfx/pulo.mp3');
        somPulo.play();
    }
});

// Listener para o término do pulo do macaco
document.addEventListener('keyup', function(event) {
    if (event.code === 'Space') {
        // Restaura as dimensões originais do macaco após o término do pulo
        macacoWidth = 80;
        macacoHeight = 80;
    }
});

// Inicia a adição de obstáculos
adicionarObstaculo();

fundo.onload = function() {
    desenharFundo();
}};