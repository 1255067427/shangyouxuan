window.onload = function () {
    // 声明一个记录点击的缩略图下标
    let bigImgIndex = 0;

    // 路径导航的数据渲染
    navPathDataBind();
    function navPathDataBind() {
        // 获取页面导航的元素对象
        let navPath = document.querySelector("#wrapper #content .contentMain #navPath");
        // 获取数据
        let path = goodData.path;
        // 遍历数据
        for (let i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                let aNode = document.createElement('a');
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);

            } else {
                // 创建a标签
                let aNode = document.createElement('a');
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                // 创建i标签
                let iNode = document.createElement('i');
                iNode.innerText = '/';

                // 让navPath元素追加a和i\
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }


        }
    }

    // 放大镜的移入、移出效果
    bigClassBind();
    function bigClassBind() {
        // 获取小图框元素
        let smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic');
        let leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');

        let imagessrc = goodData.imagessrc;

        let maskDiv = document.createElement('div');
        let bigPic = document.createElement('div');
        let bigImg = document.createElement('img');

        // 设置移动事件
        smallPic.onmousemove = function (event) {
            // event.clientX: 鼠标点距离浏览器左侧X轴的值
            // getBoundingClientRect().left：小图框元素距离浏览器左侧可视left值
            // offsetWidth：为元素的占位宽度
            let left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
            let top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

            // 判断
            // clientWidth：元素内容区宽度
            if (left < 0) {
                left = 0;
            } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                left = smallPic.clientWidth - maskDiv.offsetWidth;
            }

            if (top < 0) {
                top = 0;
            } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                top = smallPic.clientHeight - maskDiv.offsetHeight;
            }

            // 设置left 和 top 属性
            maskDiv.style.left = left + 'px';
            maskDiv.style.top = top + 'px';

            // 移动的比例关系 = 蒙版元素移动的距离 / 大图片元素移动的距离
            // 蒙版元素移动的距离 = 小图框宽度 - 蒙版元素的宽度
            // 大图片元素移动的距离 = 大图片宽度 - 大图框元素的宽度
            let scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth);
            bigImg.style.left = -left / scale + 'px';
            bigImg.style.top = -top / scale + 'px';
        }

        // 设置移入事件
        smallPic.onmouseenter = function () {

            // 创建蒙版元素
            maskDiv.className = 'mask';

            // 创建大图框元素
            bigPic.id = 'bigPic';

            // 创建大图片元素
            bigImg.src = imagessrc[bigImgIndex].b;

            //让小图框追加蒙版元素
            smallPic.appendChild(maskDiv);

            // 大图框追加大图片
            bigPic.appendChild(bigImg);

            // 让leftTop元素追加大图框
            leftTop.appendChild(smallPic);
            leftTop.appendChild(bigPic);

        }

        smallPic.onmouseleave = function () {

            // 让小图框移出蒙版元素
            smallPic.removeChild(maskDiv);

            // 让leftTop移出大图框
            leftTop.removeChild(bigPic);
        }
    }

    // 动态渲染放大镜缩略图的数据
    thumbnailData();
    function thumbnailData() {
        // 获取piclist下的ul
        let ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');

        // 获取imagessrc数据
        imagessrc = goodData.imagessrc;

        // 遍历数组
        for (let i = 0; i < imagessrc.length; i++) {
            // 创建li元素
            let newLi = document.createElement('li');

            // 创建img元素
            let newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;

            // 让li追加img元素
            newLi.appendChild(newImg);

            // 让ul追加li
            ul.appendChild(newLi);
        }
    }

    // 点击缩略图的效果
    thumbnailClick();
    function thumbnailClick() {
        // 获取所有的li元素
        let liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');

        let smallPicImg = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img');

        let imagessrc = goodData.imagessrc;

        // 小图路径需要默认和imagessrc的第一个元素小图的路径是一致的
        smallPicImg.src = imagessrc[0].s;

        // 循环点击这些li元素
        for (let i = 0; i < liNodes.length; i++) {
            // 由于页面渲染过快，一下子循环完毕，所以要给每一个元素添加上自定义下标
            liNodes[i].index = i;
            liNodes[i].onclick = function () {
                let idx = this.index;
                bigImgIndex = idx;

                // 变换小图路径
                smallPicImg.src = imagessrc[idx].s;
                console.log(smallPicImg.src);
            }
        }
    }

    // 点击缩略图左右箭头的效果
    thumbnailLeftRightClick();
    function thumbnailLeftRightClick() {

        // 获取箭头元素
        let prev = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev');
        let next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next');

        // 获取可视的div以及ul元素和所有li元素
        let piclist = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist');
        let ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');
        let liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');

        // 计算
        //发生起点
        let start = 0;
        // 步长
        let step = (liNodes[0].offsetWidth + 20) * 2;
        // 总体运动的距离值 = ul的宽度 - div 框的宽度 = (图片的总数 - div中显示的数量) * (li的宽度 + 20)
        let endPostion = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

        // 发生事件
        prev.onclick = function () {
            start -= step;
            if (start < 0) {
                start = 0;
            }
            ul.style.left = -start + 'px';
        };

        next.onclick = function () {
            start += step;
            if (start > endPostion) {
                start = endPostion;
            }
            ul.style.left = -start + 'px';
        }

    }

    // 商品详情数据的动态渲染
    rightTopData();
    function rightTopData() {
        // 查找元素
        let rightTop = document.querySelector('#wrapper #content .contentMain #center #right .rightTop');
        console.log(rightTop);

        // 查找数据
        let goodsDetail = goodData.goodsDetail;

        // 创建一个字符串变量()
        // 模板字符串替换数据：${变量}
        let s = `<h3>${goodsDetail.title}</h3>
                <p>${goodsDetail.recommend}</p>
                <div class="priceWrap">
                    <div class="priceTop">
                        <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                        <div class="price">
                            <span>￥</span>
                            <p>${goodsDetail.price}</p>
                            <i>降价通知</i>
                        </div>
                        <p>
                            <span>累计评价</span>
                            <span>670000</span>
                        </p>
                    </div>
                    <div class="priceBottom">
                        <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                        <p>
                            <span>${goodsDetail.promoteSales.type}</span>
                            <span>${goodsDetail.promoteSales.content}</span>
                        </p>
                    </div>
                </div>
                <div class="support">
                    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                    <p>${goodsDetail.support}</p>
                </div>
                <div class="address">
                    <span>配&nbsp;送&nbsp;至</span>
                    <p>${goodsDetail.address}</p>
                </div>`;

        // 重新渲染rightTop元素
        rightTop.innerHTML = s;
    }

    // 商品参数数据的动态渲染
    rightBottomData();
    function rightBottomData() {
        // 查找元素对象
        let chooseWrap = document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap');
        // 查找数据
        let crumbData = goodData.goodsDetail.crumbData;

        // 循环数据
        for (let i = 0; i < crumbData.length; i++) {
            // 创建dl元素对象
            let dlNode = document.createElement('dl');

            // 创建dt元素对象
            let dtNode = document.createElement('dt');
            dtNode.innerText = crumbData[i].title;

            // dl追加dt
            dlNode.appendChild(dtNode);

            // 遍历crumbData->data元素
            for (let j = 0; j < crumbData[i].data.length; j++) {
                // 创建dd元素
                let ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type;
                ddNode.setAttribute('price', crumbData[i].data[j].changePrice);

                //让dl追加dd
                dlNode.appendChild(ddNode);
            }

            // 让chooseWrap追加dl
            chooseWrap.appendChild(dlNode);
        }
    }

    // 点击商品参数之后的颜色排他效果
    clickddBind();
    function clickddBind() {
        // 找第一个dl下的所有dd元素
        let dlNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap dl');

        let arr = new Array(dlNodes.length);

        let choose = document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .choose');

        // 数组填充值
        arr.fill(0);

        for (let i = 0; i < dlNodes.length; i++) {

            let ddNodes = dlNodes[i].querySelectorAll('dd');

            // 遍历当前所有的dd元素
            for (let j = 0; j < ddNodes.length; j++) {
                ddNodes[j].onclick = function () {

                    // 清空choose元素
                    choose.innerHTML = "";

                    // 排他
                    for (let k = 0; k < ddNodes.length; k++) {
                        ddNodes[k].style.color = '#666';
                    }

                    // 改变颜色
                    this.style.color = 'red';

                    // 点击哪一个dd元素动态的产生一个新的mark标记元素
                    arr[i] = this;

                    changePriceBind(arr);

                    // 遍历arr数组，将非0元素的值写入到mark标记
                    arr.forEach(function (value, index) {
                        // 只要是为真，则动态创建mark标签
                        if (value) {
                            // 创建div元素
                            let markDiv = document.createElement('div');
                            // 并且设置class属性
                            markDiv.className = 'mark';
                            // 并且设置值
                            markDiv.innerText = value.innerText;
                            // 创建a元素
                            let aNode = document.createElement('a');
                            // 并且设置值
                            aNode.innerText = "X";
                            // 并且设置下标
                            aNode.setAttribute('index', index);
                            // 让div追加a
                            markDiv.appendChild(aNode);
                            // 让choose元素追加div
                            choose.appendChild(markDiv);

                        }
                    });

                    // 获取所有的a标签元素，并且循环发生点击事件
                    let aNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .choose .mark a');

                    for (let n = 0; n < aNodes.length; n++) {
                        aNodes[n].onclick = function () {
                            // 获取点击的a标签身上的index属性值
                            let idx1 = this.getAttribute('index');

                            // 恢复数组中对应下标元素的值
                            arr[idx1] = 0;

                            // 查找对应下标的那个dl行中的所有dd元素
                            let ddlist = dlNodes[idx1].querySelectorAll('dd');

                            // 遍历所有的dd元素
                            for (let m = 0; m < ddlist.length; m++) {
                                // 其余所有dd的文字颜色为灰色
                                ddlist[m].style.color = '#666';
                            }

                            // 默认的第一个dd文字颜色恢复成红色
                            ddlist[0].style.color = 'red';

                            // 删除对应下标位置的mark标记
                            choose.removeChild(this.parentNode);

                            // 调用价格函数
                            changePriceBind(arr);

                        }
                    }

                }
            }

        }

    }

    // 价格变动的函数声明
    function changePriceBind(arr) {
        // 获取价格标签
        let oldPrice = document.querySelector('#wrapper #content .contentMain #center #right .rightTop .priceWrap .priceTop .price p');

        // 取出默认价格
        let price = goodData.goodsDetail.price;

        // 遍历arr数组
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                // 数据类型强制转换
                let changePrice = Number(arr[i].getAttribute('price'));
                // 最终价格
                price += changePrice;
            }
        }
        oldPrice.innerText = price;

        // 将变化后的价格写入到标签当中
        let leftPrice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        leftPrice.innerText = '￥' + price;

        // 遍历选择搭配中所有的复选框元素，看是否有选中的
        let ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle input');
        let newPrice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');

        for (let i = 0; i < ipts.length; i++) {
            if (ipts[i].checked) {
                price += Number(ipts[i].value);
            }
        }

        // 右侧的套餐价价格重新渲染
        newPrice.innerText = '￥' + price;
    }

    // 选择搭配中间区域复选框选中套餐价变动效果
    choosePrice();
    function choosePrice() {
        // 获取复选框的元素
        let ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle input');
        let leftPrice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        let newPrice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');

        //  遍历复选框
        for (let i = 0; i < ipts.length; i++) {
            ipts[i].onclick = function () {
                let oldPrice = Number(leftPrice.innerText.slice(1));
                for (let j = 0; j < ipts.length; j++) {
                    if (ipts[j].checked) {

                        // 左侧价格 + 复选框价格
                        oldPrice += Number(ipts[j].value);
                    }
                }

                // 重新写回到套餐价中
                newPrice.innerText = '￥' + oldPrice;
            }

        }
    }

    // 封装一个公共的选项卡函数
    function tab(tabBtns, tabConts) {
        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].index = i;
            tabBtns[i].onclick = function () {
                for (let j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].className = '';
                    tabConts[j].className = '';
                }
                this.className = 'active';
                tabConts[this.index].className = 'active';
            }
        }
    }

    // 点击左侧选项卡
    leftTab();
    function leftTab() {
        // 被点击的元素
        let h4s = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideTop h4');
        // 被切换显示的元素
        let divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .aslideContent>div');
        // 调用函数
        tab(h4s, divs);
    }

    // 点击右侧选项卡
    rightTab();
    function rightTab() {
        // 被点击的元素
        let lis = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .bottomDetail .tabBtns li');
        // 被切换显示的元素
        let divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .bottomDetail .tabContents div');
        // 调用函数
        tab(lis, divs);
    }

    //右边侧边栏点击效果
    rightAsideBind();
    function rightAsideBind() {
        // 找按钮元素
        let btns = document.querySelector('#wrapper .rightAside .btns');

        // 记录初始状态
        let flag = true; // 关闭

        // 查找侧边栏元素
        let rightAside = document.querySelector('#wrapper .rightAside');

        // 发生点击事件
        btns.onclick = function () {
            // 判断
            if (flag) {
                // 展开
                btns.className = "btns btnsOpen";

                rightAside.className = "rightAside asideOpen";

            } else {
                // 关闭
                btns.className = "btns btnsClose";

                rightAside.className = "rightAside asideClose";

            }

            // 无论怎么判断，最后结果都取反
            flag = !flag;

        }
    }
}