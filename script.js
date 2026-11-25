const roleta = document.getElementById('roleta');
const btnGirar = document.getElementById('btn-girar');
const temaEl = document.getElementById('tema');
const perguntaEl = document.getElementById('pergunta');
const opcoesEl = document.getElementById('opcoes');
const mensagemEl = document.getElementById('mensagem');
const pontosEl = document.getElementById('pontos');
const vidasEl = document.getElementById('vidas');

const temas = ['História', 'Ciências', 'Geografia', 'Português', 'Cultura Pop', 'Bônus x2'];

const perguntas = {
    'História': [
        { p: 'Em que ano ocorreu a Proclamação da República no Brasil?', op: ['1822', '1889', '1500', '1964'], c: 1 },
        { p: 'Quem foi o primeiro presidente do Brasil?', op: ['Getúlio Vargas', 'Deodoro da Fonseca', 'Dom Pedro II', 'Lula'], c: 1 }
    ],
    'Ciências': [
        { p: 'Qual é o maior planeta do Sistema Solar?', op: ['Terra', 'Marte', 'Saturno', 'Júpiter'], c: 3 },
        { p: 'Qual órgão bombeia o sangue no corpo humano?', op: ['Pulmão', 'Cérebro', 'Coração', 'Fígado'], c: 2 }
    ],
    'Geografia': [
        { p: 'Qual é a capital do Paraná?', op: ['Londrina', 'Maringá', 'Curitiba', 'Cascavel'], c: 2 },
        { p: 'Qual é o maior oceano do mundo?', op: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'], c: 3 }
    ],
    'Português': [
        { p: 'Qual é o coletivo de lobos?', op: ['Alcateia', 'Manada', 'Cardume', 'Enxame'], c: 0 },
        { p: 'Qual é o antônimo de "efêmero"?', op: ['Rápido', 'Duradouro', 'Frágil', 'Pequeno'], c: 1 }
    ],
    'Cultura Pop': [
        { p: 'Quem escreveu Harry Potter?', op: ['Tolkien', 'J.K. Rowling', 'Rick Riordan', 'George Martin'], c: 1 },
        { p: 'Qual herói usa um escudo de Vibranium?', op: ['Homem de Ferro', 'Thor', 'Capitão América', 'Hulk'], c: 2 }
    ],
    'Bônus x2': [
        { p: '🔥 BÔNUS (20 pts): Quanto é 12 x 8?', op: ['86', '96', '104', '92'], c: 1, bonus: true }
    ]
};

let rotacaoAtual = 0;
let girando = false;
let pontos = 0;
let vidas = 3;

function girar() {
    if (girando || vidas <= 0) return;

    girando = true;
    btnGirar.disabled = true;
    opcoesEl.innerHTML = '';
    mensagemEl.textContent = '';
    temaEl.textContent = '🎡 Girando...';
    perguntaEl.textContent = 'Sorteando tema...';

    // Gira entre 5 e 10 voltas completas + um ângulo aleatório
    const giroExtra = Math.floor(Math.random() * 360) + 1800;
    rotacaoAtual += giroExtra;

    roleta.style.transform = `rotate(${rotacaoAtual}deg)`;

    setTimeout(() => {
        girando = false;
        const anguloFinal = rotacaoAtual % 360;
        // Calcula qual fatia parou na seta do topo
        const indice = Math.floor(((360 - anguloFinal) % 360) / 60);
        const temaSorteado = temas[indice];
        mostrarPergunta(temaSorteado);
    }, 3500);
}

function mostrarPergunta(tema) {
    const lista = perguntas[tema];
    const item = lista[Math.floor(Math.random() * lista.length)];

    temaEl.textContent = '📌 Tema: ' + tema;
    perguntaEl.textContent = item.p;
    opcoesEl.innerHTML = '';

    item.op.forEach((texto, i) => {
        const btn = document.createElement('button');
        btn.className = 'opcao-btn';
        btn.textContent = texto;
        btn.onclick = () => responder(i, item.c, item.bonus, btn);
        opcoesEl.appendChild(btn);
    });
}

function responder(escolhida, certa, isBonus, botao) {
    const todosBotoes = document.querySelectorAll('.opcao-btn');
    todosBotoes.forEach(b => b.disabled = true);

    if (escolhida === certa) {
        botao.classList.add('correta');
        const ganho = isBonus ? 20 : 10;
        pontos += ganho;
        pontosEl.textContent = pontos;
        mensagemEl.style.color = '#4ade80';
        mensagemEl.textContent = `🎉 Acertou! +${ganho} pontos! Gire novamente.`;
        btnGirar.disabled = false;
    } else {
        botao.classList.add('errada');
        todosBotoes[certa].classList.add('correta');
        vidas--;
        vidasEl.textContent = vidas;

        if (vidas <= 0) {
            mensagemEl.style.color = '#f87171';
            mensagemEl.textContent = `💀 Fim de jogo! Pontuação final: ${pontos}. Atualize a página (F5) para jogar de novo.`;
        } else {
            mensagemEl.style.color = '#fca5a5';
            mensagemEl.textContent = '❌ Errou! Perdeu 1 vida. Gire novamente.';
            btnGirar.disabled = false;
        }
    }
}
