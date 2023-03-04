const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, AgaingameOptions} = require('./options')
const token = '6053979766:AAGJOlld8NzO1LF0u9ImoLTqwDA-YOS7Jv0'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен угадать!' )
    function randomNumber() {
        const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        return arr[Math.floor(Math.random() * arr.length)];
    }
    //Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber();
    await bot.sendMessage(chatId, 'Отгадай', gameOptions);
}  

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Начальное приветсвие '},
        {command: '/info', description: 'Получить информацию о о никнейме'},
        {command: '/game', description: 'Игра с ботом'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const first_name = msg.chat.first_name,
              last_name = msg.chat.last_name;
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/1.webp')
            
            if(last_name) {
                return bot.sendMessage(chatId, `Добро пожаловать в мой бот, ${first_name} ${last_name}`)
            }else {
                return bot.sendMessage(chatId, `Добро пожаловать в мой бот, ${first_name}`)
            }
            
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Твой username: ${msg.from.username}`)
        }
        if(text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, пробуй еще раз!')
        
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return bot.sendMessage(chatId, `Молодец, ты отгадал цифру ${chats[chatId]}`, AgaingameOptions )
        } else {
            return bot.sendMessage(chatId, `Не угадал ;( Бот загадал цифру ${chats[chatId]}`, AgaingameOptions)
        }
    })
}

start();
