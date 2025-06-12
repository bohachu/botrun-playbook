#!/bin/bash

# AI Playbook 啟動腳本
# 自動處理 port 佔用並啟動本地開發伺服器

set -e  # 遇到錯誤立即退出

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
PORT=8080
PROJECT_NAME="AI Playbook"
LOG_FILE="logs/server.log"

# 函數：印出帶顏色的訊息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 函數：檢查並砍掉佔用指定 port 的程序
kill_port() {
    local port=$1
    print_info "檢查 port $port 是否被佔用..."
    
    # 查找佔用 port 的程序
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    
    if [ -n "$pids" ]; then
        print_warning "發現 port $port 被以下程序佔用："
        lsof -i:$port 2>/dev/null || true
        
        print_info "正在終止佔用 port $port 的程序..."
        for pid in $pids; do
            print_info "終止程序 PID: $pid"
            kill -9 $pid 2>/dev/null || true
        done
        
        # 等待程序完全終止
        sleep 2
        
        # 再次檢查
        local remaining_pids=$(lsof -ti:$port 2>/dev/null || true)
        if [ -n "$remaining_pids" ]; then
            print_error "無法完全清除 port $port 的佔用，請手動處理"
            exit 1
        else
            print_success "成功清除 port $port 的佔用"
        fi
    else
        print_success "port $port 未被佔用"
    fi
}

# 函數：檢查必要的依賴
check_dependencies() {
    print_info "檢查系統依賴..."
    
    # 檢查 Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python3 未安裝，請先安裝 Python3"
        exit 1
    fi
    
    # 檢查 lsof
    if ! command -v lsof &> /dev/null; then
        print_warning "lsof 未安裝，無法自動檢查 port 佔用"
    fi
    
    print_success "依賴檢查完成"
}

# 函數：創建日誌目錄
setup_logging() {
    mkdir -p logs
    print_info "日誌將輸出到: $LOG_FILE"
}

# 函數：啟動開發伺服器
start_server() {
    print_info "啟動 $PROJECT_NAME 開發伺服器..."
    print_info "伺服器地址: http://localhost:$PORT"
    print_info "按 Ctrl+C 停止伺服器"
    
    # 啟動 Python HTTP 伺服器並輸出日誌
    {
        echo "=== $(date) ==="
        echo "啟動 $PROJECT_NAME 開發伺服器"
        echo "Port: $PORT"
        echo "=========================="
    } >> "$LOG_FILE"
    
    # 啟動伺服器（前景執行）
    python3 -m http.server $PORT 2>&1 | tee -a "$LOG_FILE"
}

# 函數：啟動背景伺服器
start_background_server() {
    print_info "啟動 $PROJECT_NAME 開發伺服器（背景模式）..."
    
    # 啟動背景伺服器
    nohup python3 -m http.server $PORT > "$LOG_FILE" 2>&1 &
    local server_pid=$!
    
    # 等待伺服器啟動
    sleep 3
    
    # 檢查伺服器是否成功啟動
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT | grep -q "200"; then
        print_success "伺服器成功啟動！"
        print_info "伺服器地址: http://localhost:$PORT"
        print_info "伺服器 PID: $server_pid"
        print_info "日誌檔案: $LOG_FILE"
        print_info "停止伺服器: kill $server_pid"
        
        # 儲存 PID 到檔案
        echo $server_pid > .server_pid
        
        # 開啟瀏覽器（可選）
        if command -v open &> /dev/null; then
            print_info "正在開啟瀏覽器..."
            open http://localhost:$PORT
        fi
    else
        print_error "伺服器啟動失敗"
        exit 1
    fi
}

# 函數：停止背景伺服器
stop_server() {
    if [ -f .server_pid ]; then
        local pid=$(cat .server_pid)
        print_info "停止伺服器 (PID: $pid)..."
        kill $pid 2>/dev/null || true
        rm -f .server_pid
        print_success "伺服器已停止"
    else
        print_warning "找不到運行中的伺服器"
    fi
}

# 函數：顯示伺服器狀態
show_status() {
    print_info "檢查伺服器狀態..."
    
    if [ -f .server_pid ]; then
        local pid=$(cat .server_pid)
        if ps -p $pid > /dev/null 2>&1; then
            print_success "伺服器正在運行 (PID: $pid)"
            print_info "伺服器地址: http://localhost:$PORT"
            
            # 檢查 HTTP 回應
            local http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT)
            if [ "$http_code" = "200" ]; then
                print_success "HTTP 服務正常 (狀態碼: $http_code)"
            else
                print_warning "HTTP 服務異常 (狀態碼: $http_code)"
            fi
        else
            print_warning "PID 檔案存在但程序未運行"
            rm -f .server_pid
        fi
    else
        print_info "伺服器未運行"
    fi
    
    # 顯示 port 佔用情況
    print_info "Port $PORT 佔用情況："
    lsof -i:$PORT 2>/dev/null || print_info "Port $PORT 未被佔用"
}

# 函數：顯示日誌
show_logs() {
    if [ -f "$LOG_FILE" ]; then
        print_info "顯示最近的日誌 (最後 50 行)："
        tail -50 "$LOG_FILE"
    else
        print_warning "日誌檔案不存在: $LOG_FILE"
    fi
}

# 函數：清理資源
cleanup() {
    print_info "清理資源..."
    rm -f .server_pid
    print_success "清理完成"
}

# 函數：顯示幫助訊息
show_help() {
    echo "AI Playbook 開發伺服器管理腳本"
    echo ""
    echo "用法: $0 [選項]"
    echo ""
    echo "選項:"
    echo "  start, s      啟動伺服器（前景模式）"
    echo "  background, bg 啟動伺服器（背景模式）"
    echo "  stop          停止背景伺服器"
    echo "  restart, r    重啟伺服器"
    echo "  status        顯示伺服器狀態"
    echo "  logs, l       顯示伺服器日誌"
    echo "  cleanup, c    清理資源"
    echo "  help, h       顯示此幫助訊息"
    echo ""
    echo "範例:"
    echo "  $0 start      # 啟動伺服器（前景）"
    echo "  $0 bg         # 啟動伺服器（背景）"
    echo "  $0 status     # 檢查狀態"
    echo "  $0 stop       # 停止伺服器"
}

# 主程式
main() {
    print_info "=== $PROJECT_NAME 開發伺服器管理 ==="
    
    # 解析命令列參數
    case "${1:-start}" in
        "start"|"s")
            check_dependencies
            setup_logging
            kill_port $PORT
            start_server
            ;;
        "background"|"bg")
            check_dependencies
            setup_logging
            kill_port $PORT
            start_background_server
            ;;
        "stop")
            stop_server
            ;;
        "restart"|"r")
            stop_server
            sleep 2
            check_dependencies
            setup_logging
            kill_port $PORT
            start_background_server
            ;;
        "status")
            show_status
            ;;
        "logs"|"l")
            show_logs
            ;;
        "cleanup"|"c")
            cleanup
            ;;
        "help"|"h"|"--help")
            show_help
            ;;
        *)
            print_error "未知的選項: $1"
            show_help
            exit 1
            ;;
    esac
}

# 捕捉中斷信號
trap 'print_info "收到中斷信號，正在清理..."; cleanup; exit 0' INT TERM

# 執行主程式
main "$@" 