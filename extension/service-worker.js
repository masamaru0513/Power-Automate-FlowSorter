// タブが更新されたときにイベントリスナーを追加
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // タブの状態が 'complete' で、URLに "/flows" が含まれている場合
    if (changeInfo.status === 'complete' && tab.url.includes("/flows")) {
        // タブにメッセージを送信
        chrome.tabs.sendMessage(tabId, {
            message: 'urlChanged', // メッセージの種類を指定
            url: tab.url // 現在のタブのURLを送信
        });
    }
    return true;
});