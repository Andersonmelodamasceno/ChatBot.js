const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');
const client = new Client();

// Objeto para armazenar o status de interação dos usuários
const userStatus = {};

const categoria = {
    '1': '1️⃣ *CAIXAS DE AVICULTURA*',
    '2': '2️⃣ *AGRICULTURA E ALIMENTOS*',
    '3': '3️⃣ *PESCADOS*',
    '4': '4️⃣ *MULTIUSO*',
    '5': '5️⃣ *MOVEIS PLÁSTICOS*', // Mantém o acento na exibição
    '6': '6️⃣ *GARRAFEIRAS*',
    '7': '7️⃣ *TERMICOS*', // Mantém o acento na exibição
    '8': '8️⃣ *PALETES*'
};

const PRODUTOS = {
    'CAIXAS DE AVICULTURA': {
        '1': '1️⃣ *FRANGO CONGELADO*',
        '2': '2️⃣ *CTO*',
        '3': '3️⃣ *BANDEJA DE OVOS*',
        '4': '4️⃣ *GAIOLA BAIXA*',
        '5': '5️⃣ *GAIOLA ALTA*'
    },
    'AGRICULTURA E ALIMENTOS': {
        '1': '1️⃣ *CE 21*',
        '2': '2️⃣ *CE 18F*',
        '3': '3️⃣ *CE 17*',
        '4': '4️⃣ *CE 20*',
        '5': '5️⃣ *CE 23*',
        '6': '6️⃣ *CTAIG 200 TF*',
        '7': '7️⃣ *CTAIG 200 TA*',
        '8': '8️⃣ *CTAIG 101*',
        '9': '9️⃣ *FRANGÃO VAZADO*',
        '10': '1️⃣0️⃣ *BANDEJA DE PÃES*',
        '11': '1️⃣1️⃣ *BR 1000 BAIXA*',
        '12': '1️⃣2️⃣ *BR 1000 ALTA*'
    },
    'PESCADOS': {
        '1': '1️⃣ *CIC 20 CAIXA DE CAMARÃO*',
        '2': '2️⃣ *CAIXA DE PESCADO CIP 25*'
    },
    'MULTIUSO': {
        '1': '1️⃣ *CE 24*',
        '2': '2️⃣ *FLAT BOX*',
        '3': '3️⃣ *CE 35*',
        '4': '4️⃣ *CTM*',
        '5': '5️⃣ *CESTA FEIRA*',
        '6': '6️⃣ *DRY DECK*'
    },
    'MOVEIS PLASTICOS': {
        '1': '1️⃣ *MESA QUADRADA MONOBLOCO*',
        '2': '2️⃣ *CADEIRA BISTRÔ SÓLIDA*',
        '3': '3️⃣ *CADEIRA BISTRÔ VAZADA*',
        '4': '4️⃣ *POLTRONA PÉGASUS*'
    },
    'GARRAFEIRAS': {
        '1': '1️⃣ *CTG 9*',
        '2': '2️⃣ *CTG 3*',
        '3': '3️⃣ *CTG 3B*',
        '4': '4️⃣ *CTG 4*',
        '5': '5️⃣ *CTG 7*',
        '6': '6️⃣ *CTG 10 KS ULTRA*',
        '7': '7️⃣ *CTG 1*',
        '8': '8️⃣ *CTG 2*',
        '9': '9️⃣ *CTG 15*',
        '10': '1️⃣0️⃣ *CTG 17*',
        '11': '1️⃣1️⃣ *CTG 13*',
        '12': '1️⃣2️⃣ *CTG 16*',
        '13': '1️⃣3️⃣ *CTG 20*'
    },
    'TERMICOS': {
        '1': '1️⃣ *LATAS*',
        '2': '2️⃣ *LITRINHO*',
        '3': '3️⃣ *BINECK*',
        '4': '4️⃣ *600ML*',
        '8': '8️⃣ *LITRÃO*'
    },
    'PALETES': {
        '1': '1️⃣ *ESTRADO SMART*',
        '2': '2️⃣ *ESTRADO EXPORTAÇÃO*',
        '3': '3️⃣ *ESTRADO MULTI*',
        '4': '4️⃣ *ESTRADO HEAVY*',
        '5': '5️⃣ *ESTRADO EXPORTAÇÃO LISO*',
        '6': '6️⃣ *PALETE MULTI*',
        '7': '7️⃣ *PALETE PESADO 3R*',
        '8': '8️⃣ *PALETE PESADO 6R*',
        '9': '9️⃣ *PALETE MULTI LISO*',
        '10': '1️⃣0️⃣ *PALETE DE CONTENÇÃO 1T*',
        '11': '1️⃣1️⃣ *PALETE DE CONTENÇÃO 2T*',
        '12': '1️⃣2️⃣ *PALETE DE CONTENÇÃO 4T*'
    }
};

// Função para extrair números de uma string
function extrairNumero(texto) {
    const numeros = texto.match(/\d+/); // Encontra todos os dígitos na string
    return numeros ? numeros[0] : null; // Retorna o primeiro número encontrado ou null
}

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.on('message', async msg => {
    const userPhone = msg.from; // Identificador do usuário

    if (msg.from.endsWith('@g.us')) {
        return; // Ignora mensagens de grupos
    }

    // Inicializa o status do usuário se não existir
    if (!userStatus[userPhone]) {
        userStatus[userPhone] = { estado: 'inicio', produtosEscolhidos: [] };
    }

     // Verifica se a mensagem contém a palavra "currículo"
     if (msg.body.toLowerCase().includes('currículo', '')) {
        await client.sendMessage(msg.from, 'Este WhatsApp é exclusivo para uso comercial. Por favor, envie seu currículo através do nosso site : https://centraldeembalagens.com.br/trabalhe-conosco/ Obrigado! 😊');
        return; // Encerra a execução para esta mensagem
    }

    // Caso o usuário interaja com o menu de categorias
    if (msg.body.match(/\b(menu|dia|tarde|noite|oi|Oi|Ola|Olá|bom dia|boa tarde|boa noite)\b/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const name = contact.pushname;

        // Cria a lista de categorias com emojis
        const listaCategorias = Object.keys(categoria).map(key => `${categoria[key]}`).join('\n');

        await client.sendMessage(msg.from, `Olá! ${name.split(" ")[0]}, sou o assistente virtual da *Central de Embalagens* 🤖. Este WhatsApp é exclusivo para uso comercial. Digite uma das opções abaixo:\n\n${listaCategorias}\n\nPara mais informações, acesse nosso catálogo completo no site 💻📱  : https://centraldeembalagens.com.br/wp-content/uploads/2024/12/Catalogo_CentraldeEmbalgens_V6_Nov24.pdf`);
        userStatus[userPhone].estado = 'categoriaEscolhida';
    }

    // Caso o usuário escolha uma categoria válida
    else if (userStatus[userPhone].estado === 'categoriaEscolhida') {
        const numero = extrairNumero(msg.body); // Extrai o número da mensagem

        if (numero && categoria[numero]) {
            const categoriaEscolhida = categoria[numero];

            if (PRODUTOS[categoriaEscolhida.replace(/[^a-zA-Z ]/g, '').trim()]) {
                // Marca que o usuário escolheu a categoria e está pronto para escolher um produto
                userStatus[userPhone].categoria = categoriaEscolhida;

                const listaProdutos = Object.keys(PRODUTOS[categoriaEscolhida.replace(/[^a-zA-Z ]/g, '').trim()]).map(key => `${PRODUTOS[categoriaEscolhida.replace(/[^a-zA-Z ]/g, '').trim()][key]}`).join('\n');
                await client.sendMessage(msg.from, `Você escolheu a categoria: ${categoriaEscolhida}. Aqui estão os produtos disponíveis:\n\n${listaProdutos}\n\nDigite o número do produto para mais informações ou digite *'finalizar'* para concluir a seleção e iniciar o Atendimento.`);
                userStatus[userPhone].estado = 'produtoEscolhido';
            } else {
                await client.sendMessage(msg.from, 'Desculpe, a categoria escolhida não existe. Por favor, escolha um número válido entre 1 e 8.');
            }
        }
    
    }
        else if (userStatus[userPhone].estado === 'produtoEscolhido') {
            if (msg.body.toLowerCase() === 'finalizar') {
                const produtosEscolhidos = userStatus[userPhone].produtosEscolhidos.join(', ');
                await client.sendMessage(msg.from, `Você escolheu os seguintes produtos:\n\n${produtosEscolhidos}\n\nOlá! 😊 Eu sou a *Maria*, Vou fazer o seu atendimento! *Qual o Seu Nome ?*`);
                userStatus[userPhone].estado = 'atendimento';
            } else if (msg.body.toLowerCase() === 'voltar') {
                // Retorna para a seleção de categoria sem perder os produtos já escolhidos
                const listaCategorias = Object.keys(categoria).map(key => `${categoria[key]}`).join('\n');
                await client.sendMessage(msg.from, `Você voltou para a escolha de categoria. Seus produtos escolhidos até agora:\n\n${userStatus[userPhone].produtosEscolhidos.join(', ') || '*Nenhum produto escolhido ainda.*'}\n\nEscolha uma nova categoria:\n\n${listaCategorias}`);
                userStatus[userPhone].estado = 'categoriaEscolhida';
            } else {
                const { categoria: categoriaEscolhida } = userStatus[userPhone];
                let produtoEscolhido = PRODUTOS[categoriaEscolhida.replace(/[^a-zA-Z ]/g, '').trim()][msg.body];
        
                if (produtoEscolhido) {
                    userStatus[userPhone].produtosEscolhidos.push(produtoEscolhido);
                    await client.sendMessage(msg.from, `Produto ${produtoEscolhido} adicionado à sua lista.\n\n✅ Você pode escolher mais produtos da mesma categoria, digitar *'voltar'* para selecionar outra categoria, ou *'finalizar'* para concluir a seleção e iniciar o Atendimento.`);
                } else {
                    await client.sendMessage(msg.from, 'Desculpe, não entendi. Digite o *número do produto válido*, *voltar* para escolher outra categoria ou *finalizar* concluir a seleção e iniciar o Atendimento.');
                }
            }
        }       

});

client.initialize();