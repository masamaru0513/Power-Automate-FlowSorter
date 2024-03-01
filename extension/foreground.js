// 定数: 監視対象の要素のクラス名
const TARGET_CLASS_NAME = '.ms-List';

/**
 * タブが更新されたときにservice-workerからの応答を受け取る
 */
chrome.runtime.onMessage.addListener((response) => {
    if (response.message === 'urlChanged' && response.url.includes("/flows") && !response.url.endsWith("/details")) {
        waitForElement();
    }
});

/**
 * 監視対象の要素が存在するかチェックし、存在する場合は processElement 関数を呼び出す
 * 存在しない場合は、500ミリ秒後に再度チェックを行う
 */
function waitForElement() {
    const targetElement = document.querySelector(TARGET_CLASS_NAME);
    if (targetElement) {
        processElement(targetElement);
    } else {
        setTimeout(waitForElement, 500);
    }
}

/**
 * 与えられた要素のリストからURLごとに要素をグループ化する
 * @param {NodeList} msListCell - 要素のリスト
 * @returns {Object} - urlList と groupedElements を含むオブジェクト
 */
function getGroupedElements(msListCell) {
    let urlList = [];
    let groupedElements = {};

    msListCell.forEach(ele => {
        const spanElement = ele.querySelector("span.fl-FlowIcon-MainIcon");
        if (spanElement) {
            const style = spanElement.getAttribute('style');
            const urlMatch = style.match(/url\("(.+?)"\)/);
            if (urlMatch && urlMatch[1]) {
                const url = urlMatch[1];
                if (!urlList.includes(url)) {
                    urlList.push(url);
                    groupedElements[url] = [];
                }
                groupedElements[url].push(ele);
            }
        }
    });

    return { urlList, groupedElements };
}

/**
 * 監視対象の要素を更新する
 * @param {HTMLElement} targetElement - 監視対象の要素
 * @param {Array} urlList - URLのリスト
 * @param {Object} groupedElements - グループ化された要素のオブジェクト
 */
function updateTargetElement(targetElement, urlList, groupedElements) {
    targetElement.innerHTML = '';
    urlList.forEach(url => {
        groupedElements[url].forEach(ele => {
            targetElement.appendChild(ele);
        });
    });
}

/**
 * 監視対象の要素を処理する
 * - ".ms-List-cell" クラスを持つ要素をすべて取得
 * - 要素をURLごとにグループ化
 * - 監視対象の要素を更新
 * @param {HTMLElement} targetElement - 監視対象の要素
 */
function processElement(targetElement) {
    const msListCell = document.querySelectorAll(".ms-List-cell");
    const { urlList, groupedElements } = getGroupedElements(msListCell);
    updateTargetElement(targetElement, urlList, groupedElements);
}

// 監視を開始する
waitForElement();