/**
 * TG Proxy Server
 * 
 * 免责声明：本项目仅供技术研究和学习交流之用
 * 使用者应遵守当地法律法规，不得用于任何非法用途
 * 开发者不对使用本项目产生的任何后果负责
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 7070;

// 启用CORS，允许跨域请求
app.use(cors());
app.use(express.json());

// 代理TG请求的API接口
app.get('/tg/s/*', async (req, res) => {
    try {
        // 提取TG频道路径和查询参数
        const tgPath = req.params[0]; // 获取 * 匹配的部分
        const queryParams = req.query; // 获取查询参数
        
        // 构建目标URL
        let targetUrl = `https://t.me/s/${tgPath}`;
        
        // 如果有查询参数，添加到URL中
        if (Object.keys(queryParams).length > 0) {
            const searchParams = new URLSearchParams(queryParams);
            targetUrl += `?${searchParams.toString()}`;
        }
        
        console.log(`代理请求: ${targetUrl}`);
        
        // 发起请求到TG
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
            timeout: 30000, // 30秒超时
            maxRedirects: 5, // 最大重定向次数
        });
        
        // 原封不动返回TG的响应
        res.set({
            'Content-Type': response.headers['content-type'] || 'text/html',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });
        
        res.status(response.status).send(response.data);
        
    } catch (error) {
        console.error('代理请求失败:', {
            url: req.url,
            error: error.message,
            status: error.response?.status || 'unknown'
        });
        
        if (error.response) {
            // TG服务器返回了错误状态
            res.status(error.response.status).send(error.response.data);
        } else if (error.code === 'ECONNABORTED') {
            // 请求超时
            res.status(408).json({ 
                error: '请求超时',
                message: 'Request timeout'
            });
        } else if (error.code === 'ENOTFOUND') {
            // DNS解析失败
            res.status(502).json({ 
                error: '无法连接到目标服务器',
                message: 'Cannot connect to target server'
            });
        } else {
            // 其他错误
            res.status(500).json({ 
                error: '代理服务器错误',
                message: error.message 
            });
        }
    }
});

// 健康检查接口
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'TG Proxy Server',
        version: '1.0.0'
    });
});

// 测试TG连接性
app.get('/test', async (req, res) => {
    try {
        const testUrl = 'https://t.me/s/telegram';
        const response = await axios.get(testUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        res.json({
            status: 'success',
            message: 'TG连接正常',
            statusCode: response.status,
            contentLength: response.data.length
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'TG连接失败',
            error: error.message
        });
    }
});

// 根路径说明
app.get('/', (req, res) => {
    res.json({
        message: 'TG代理服务器运行中',
        usage: {
            proxy: 'GET /tg/s/{channel_id}?q={search_term}',
            health: 'GET /health',
            test: 'GET /test'
        },
        examples: [
            '/tg/s/zyfb123',
            '/tg/s/zyfb123?q=复仇者联盟',
            '/tg/s/zyfb123?before=123456'
        ],
        note: '所有请求参数将原样转发到 t.me'
    });
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('未捕获的错误:', error);
    res.status(500).json({
        error: '服务器内部错误',
        message: error.message
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        error: '接口不存在',
        message: `路径 ${req.path} 未找到`,
        availableRoutes: [
            'GET /',
            'GET /health', 
            'GET /test',
            'GET /tg/s/*'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`TG代理服务器启动成功，端口: ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}`);
    console.log(`健康检查: http://localhost:${PORT}/health`);
    console.log(`连接测试: http://localhost:${PORT}/test`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到SIGTERM信号，正在关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('收到SIGINT信号，正在关闭服务器...');
    process.exit(0);
});

module.exports = app;