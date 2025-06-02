# TG Proxy Server

Telegram频道代理服务器，用于转发t.me请求，解决无法直接访问Telegram网页版的问题。

## 免责声明

**重要提示：本项目仅供技术研究和学习交流之用！**

- 本项目仅作为个人学习Node.js、Express和代理服务开发的示例
- 使用者应遵守当地法律法规，不得用于任何非法用途
- 使用本项目访问的所有内容均来自第三方网站，与本项目作者无关
- 请勿用于任何商业用途或大规模部署
- 开发者不对使用本项目产生的任何后果负责
- 如果您的使用行为违反了当地法律法规，后果自负

**使用本项目即表示您已阅读并同意上述免责声明。**

## 功能特点

- 代理Telegram公开频道内容，支持浏览和搜索
- 支持移动端和桌面端访问
- 支持查询参数转发
- 自动处理跨域请求
- 健康检查和连接测试API

## 技术栈

- Node.js
- Express.js
- Axios
- Docker

## 快速开始

### 本地安装

```bash
# 克隆仓库
git clone https://github.com/xiaoyao20084321/tg-proxy.git
cd tg-proxy

# 安装依赖
npm install

# 启动服务器
npm start
```

服务器将在 http://localhost:7070 启动

### Docker部署

```bash
# 使用Docker Compose (推荐，支持自动重启)
docker-compose up -d
```

或者

```bash
# 直接使用Docker (需要添加--restart参数实现自动重启)
docker run -p 7070:7070 --restart always songnidedubai/tg-proxy
```

## API使用说明

### 代理Telegram频道

```
GET http://localhost:7070/s/{channel_id}
```

例如：
- `http://localhost:7070/s/telegram` - 访问Telegram官方频道
- `http://localhost:7070/s/durov` - 访问Pavel Durov的频道

### 搜索频道内容

```
GET http://localhost:7070/s/{channel_id}?q={search_term}
```

例如：
- `http://localhost:7070/s/telegram?q=update` - 搜索Telegram频道中包含"update"的内容

### 健康检查

```
GET http://localhost:7070/health
```

返回服务健康状态信息

### 连接测试

```
GET http://localhost:7070/test
```

测试与Telegram服务器的连接

## 部署到云服务

本项目可以部署到各种云平台，以下是几种常见方式：

### 使用Docker Hub镜像

本项目已发布到Docker Hub：
- 镜像名称: `songnidedubai/tg-proxy`
- 支持架构: amd64和arm64

### 在云服务器上部署

1. 登录您的云服务器
2. 安装Docker和Docker Compose
3. 创建`docker-compose.yml`文件：
```yaml
version: '3'

services:
  tg-proxy:
    image: songnidedubai/tg-proxy:latest
    container_name: tg-proxy
    restart: always
    ports:
      - "7070:7070"
    environment:
      - NODE_ENV=production
```
4. 运行`docker-compose up -d`启动服务
5. 访问`http://您的服务器IP:7070`测试服务

### 使用Claw.cloud平台部署

1. 登录[Claw.cloud](https://run.claw.cloud/)平台
2. 创建新应用，选择"Public"镜像
3. 镜像名称填写：`songnidedubai/tg-proxy`
4. 容器端口设置为：`7070`
5. 开启公共访问
6. 点击"Deploy Application"部署

### 其他云平台

本项目也适用于其他支持Docker的云平台，如AWS、Google Cloud、Azure等：
- 使用云平台的容器服务(如AWS ECS、GCP Cloud Run)
- 设置容器镜像为`songnidedubai/tg-proxy`
- 配置端口映射：7070
- 设置自动重启策略

## 配置选项

服务器默认端口为7070，可通过环境变量修改：

```bash
PORT=8080 npm start
```

## 贡献指南

欢迎提交Pull Request或创建Issue！

## 许可证

[MIT License](LICENSE) 