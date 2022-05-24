function Music() {
    //获取数据
    this.getData();
    //绑定事件
    this.bindEve();
}
//绑定事件函数
Music.prototype.bindEve = function () {
    //给添加的确认键绑定点击事件
    this.$('.confirmAdd').addEventListener('click', this.addConfirm.bind(this));
    //给tbody绑定事件
    this.$('.table tbody').addEventListener('click', this.select.bind(this));
    //给删除按钮里的确认绑定点击事件
    this.$('.confirm-del').addEventListener('click', this.confirmDel.bind(this));
    //给修改按钮里的确认按钮绑定事件
    this.$('.confirmModify').addEventListener('click', this.confirmModify.bind(this));
}
//委托给tbody绑定事件  删除和修改按钮的事件委托
Music.prototype.select = function (event) {
    // console.log(event);
    //获取当前点击的节点
    let target = event.target;
    // console.log(this.target);
    //通过class判断当前点击的是删除还是修改
    if (target.classList.contains('btn-del')) {
        // console.log('删除');
        //调用显示删除模态框的方法
        this.delData(target);
    }
    if (target.classList.contains('btn-modify')) {
        // console.log('修改哈哈哈');
        this.modifyData(target);
    }
}
//修改数据的方法
Music.prototype.modifyData = function (target) {
    //先显示模态框
    // console.log(target);
    $('#modifyModal').modal('show');
    //获取要修改的数据   显示到input框中
    let tr = this.getTr(target);
    // console.log(tr);
    let id = tr.children[0].innerHTML;
    let name = tr.children[1].innerHTML;
    let singer = tr.children[2].innerHTML;
    let album = tr.children[3].innerHTML;
    let time = tr.children[4].innerHTML;
    // console.log(id,name, singer, album, time);
    //把id保存一下 发送请求时候用
    this.modifyId = id;
    //获取input框
    let input = this.$('#modifyModal form').elements;
    // console.log(input);
    input.name.value = name;
    input.singer.value = singer;
    input.album.value = album;
    input.time.value = time;
}
//修改确认点击事件
Music.prototype.confirmModify = function () {
    // console.log('确认修改...');
    //获取输入框内输入的内容
    let input = this.$('#modifyModal form').elements;
    // console.log(input);
    let name =input.name.value.trim();
    let singer =input.singer.value.trim();
    let album =input.album.value.trim();
    let time =input.time.value.trim();
    // console.log(name);
    //判断是否输入为空
    if (!name || !singer || !album || !time) {
        alert('输入不能为空...');
        return;
    }
    //发送请求 修改保存数据
    axios.put('http://localhost:3000/music/' + this.modifyId, {
        name, singer, album, time
    }).then(res => {
        // console.log(res);
        if (res.status) {
            location.reload();
        }
    })
}
//删除数据方法
Music.prototype.delData = function (target) {
    // console.log('删除');
    //保存target给后面使用
    this.target = target;
    //显示模态框
    $('#delModal').modal('show');
}
//获取tr的封装函数
Music.prototype.getTr = function (target) {
    if (target.nodeName == 'TR') {
        return target;
    } else {
        //递归函数
        return this.getTr(target.parentNode);
    }
}
//删除按钮确认按钮
Music.prototype.confirmDel = function () {
    //获取当前点击数据的id
    //首先获取到当前数据的tr节点
    // console.log(this.target.nodeName);
    let id = 0;
    //方法2、调用递归方法 获得tr
    let tr = this.getTr(this.target);
    // console.log(tr);
    id = tr.firstElementChild.innerHTML;
    // console.log(id);
    //判断当前点击的是span标签还是button标签
    //方法1、通过判断节点名字
    // if(this.target.nodeName=='SPAN'){
    //     let tr=this.target.parentNode.parentNode.parentNode;
    //     id = tr.firstElementChild.innerHTML;
    //     // console.log(id);
    // }else if(this.target.nodeName=='BUTTON'){
    //     let tr=this.target.parentNode.parentNode;
    //     id = tr.firstElementChild.innerHTML;
    //     // console.log(id);
    // }
    //发送请求删除当前点击的id数据
    axios.delete('http://localhost:3000/music/' + id).then(res => {
        // console.log(res);
        //当返回值中的status为200时候删除成功
        if (res.status == 200) {
            location.reload();
        }
    })
}
//添加按钮确认事件
Music.prototype.addConfirm = function () {
    // console.log(1111);
    //先获取input框中输入的内容
    //先获取input节点
    let inputObj = this.$('#addModal form').elements;
    // console.log(inputObj);
    let name = inputObj.name.value.trim();
    let singer = inputObj.singer.value.trim();
    let album = inputObj.album.value.trim();
    let time = inputObj.time.value.trim();
    // console.log(name,singer,album,time);
    //判断是否输入为空
    if (!name || !singer || !album || !time) {
        alert('不能为空...');
        return;
    }
    //发送保存请求  将获取的内容保存在json中  post方法为保存
    axios.post('http://localhost:3000/music', {
        name, singer, album, time
    }).then(res => {
        // console.log(res);
        //放status为201时候表示保存成功  刷新页面
        if (res.status == 201) {
            location.reload();
        }
    })
}
//获取数据调用方法
Music.prototype.getData = function () {
    // console.log('获取数据');
    //发送ajax请求获取数据
    axios.get('http://localhost:3000/music')
        .then(res => {
            // console.log(res);
            //获取res中的data和status
            let { data, status } = res;
            // console.log(data,status);
            if (status = 200) {
                //遍历data拿到里面的数据
                let html = '';
                data.forEach(ele => {
                    // console.log(ele);
                    //拼接字符串
                    html += `<tr>
                            <th scope="row">${ele.id}</th>
                            <td>${ele.name}</td>
                            <td>${ele.singer}</td>
                            <td>${ele.album}</td>
                            <td>${ele.time}</td>
                            <td>
                                <button type="button" class="btn btn-warning btn-xs btn-modify">修改
                                    <span class="glyphicon glyphicon-repeat btn-modify" aria-hidden="true"></span>
                                </button>
                                <button type="button" class="btn btn-danger btn-xs btn-del">删除
                                    <span class="glyphicon glyphicon-trash btn-del" aria-hidden="true"></span>
                                </button>
                            </td>
                        </tr>`;
                    //追加到页面中
                    this.$('.table tbody').innerHTML = html;
                });
            }
        })
}
//获取节点的封装函数
Music.prototype.$ = function (ele) {
    let res = document.querySelector(ele);
    //判断是单个节点还是多个
    return res.length == 1 ? res[0] : res;
}
new Music();