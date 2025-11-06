#!/bin/bash

# 获取当前分支名
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 根据分支名选择对应的 .env 文件
if [[ "$BRANCH" == "main" ]] || [[ "$BRANCH" == "master" ]]; then
    ENV_FILE=".env.production"
elif [[ "$BRANCH" == "develop" ]] || [[ "$BRANCH" == "dev" ]]; then
    ENV_FILE=".env.develop"
else
    ENV_FILE=".env.develop"  # 默认使用开发环境
fi

# 如果对应的 .env 文件存在，复制为 .env.local
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" .env.local
    echo "✓ 已切换到 $ENV_FILE 配置（分支: $BRANCH）"
else
    echo "⚠ 警告: $ENV_FILE 不存在，使用默认配置"
fi