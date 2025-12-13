# Bill · Voice-enabled Ledger

前端使用 **React + Vite + Ant Design**，后端使用 **FastAPI** 提供语音/手动记账与仪表盘接口。

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Frontend (React + AntD)

```bash
cd frontend
npm install
npm run dev
```

Vite 已配置将 `/api` 代理到 `http://127.0.0.1:8000`，确保先启动后端即可联调。

## Next Steps

- 接入真实的数据库和语音识别服务以替换当前的内存存储及简单解析。
- 扩展 Dashboard API（预算、趋势、周/月汇总等）。
