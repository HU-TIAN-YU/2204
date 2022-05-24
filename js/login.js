class Game {
    //构造方法，实例化对象的时候调用
    constructor() {
        //调用获取数据方法
        this.getData();
        this.bindEve();
    }
    //绑定事件
    bindEve() {
        //给保存按钮绑定点击按钮，调用保存数据方法
        //bind改变this 指向当前实例化对象
        this.$('.save-data').addEventListener('click', this.saveData.bind(this));
        //事件委托 把点击事件委托给tbody处理
        this.$('.table tbody').addEventListener('click', this.distribute.bind(this));
        //给删除按钮的确认绑定点击事件
        this.$('.confirm-del').addEventListener('click', this.confirmDel.bind(this));
        //给修改按钮的确认修改绑定点击事件
        this.$('.modify-data').addEventListener('click', this.saveModify.bind(this));
    }
    //tbody点击的回调函数
    distribute(event) {
        //target为事件源
        // console.log(event.target);
        let target = event.target;
        //判断当前点击的是删除按钮btn-del 还是修改按钮btn-modify
        //删除按钮
        if (target.classList.contains('btn-del')) {
            this.delData(target);
        }
        //修改按钮btn-modify
        if (target.classList.contains('btn-modify')) {
            this.modifyData(target);
        }
    }
    //找到tr节点的封装函数
    findTr(target) {
        // console.log(target);
        //利用递归函数 找到tr节点
        if (target.nodeName == 'TR') {
            return target;
        } else {
            return this.findTr(target.parentNode);
        }
    }
    //点击修改按钮触发的事件
    modifyData(target) {
        // console.log(target);
        //弹出修改的模态框
        $('#modifyModal').modal('show');
        //获取要修改的数据 显示在input框内
        let tr = this.findTr(target);
        // console.log(tr);
        let chil = tr.children;
        let id = chil[0].innerHTML;
        let name = chil[1].innerHTML;
        let age = chil[2].innerHTML;
        let info = chil[3].innerHTML;
        // console.log(id,name,age,info);
        //设置到input内
        let input = this.$('#modifyModal form').elements;
        // console.log(input);
        input.name.value = name;
        input.age.value = age;
        input.info.value = info;
        //保存id 设置为属性
        this.modifyId = id;
    }
    //修改按钮确认点击后的事件
    saveModify() {
        // console.log(this.modifyId);
        //收集input修改后的数据
        let input = this.$('#modifyModal form').elements;
        let { name, age, info } = input;
        // console.log(name,age,info);
        // let nameVal = name.value.trim();
        // let ageVal = age.value.trim();
        // let infoVal = info.value.trim();
        // console.log(nameVal,ageVal,infoVal);
        //判断是否为空
        if (!name.value.trim() || !age.value.trim() || !info.value.trim()) {
            alert('不能为空')
            return;
        }
        //给后台发送数据进行修改
        axios.put('http://localhost:3000/game/' + this.modifyId, {
            name: name.value.trim(),
            age: age.value.trim(),
            info: info.value.trim()
        }).then(res => {
            // console.log(res);
            //当状态码为200时候为成功，刷新页面
            if (res.status == 200) {
                location.reload();
            }
        })
    }

    //删除数据的方法
    delData(target) {
        // console.log(1111);
        this.target = target;
        //删除弹出模态框
        $('#delModal').modal('show');

    }
    //确认删除点击事件方法
    confirmDel() {
        //找到tr中的id
        let id = 0;
        //判断当前点击的是span还是button
        if (this.target.nodeName == 'SPAN') {
            let tr = this.target.parentNode.parentNode.parentNode;
            // console.log(tr);
            //获取id
            id = tr.firstElementChild.innerHTML;
        } else if (this.target.nodeName == 'BUTTON') {
            let tr = this.target.parentNode.parentNode;
            id = tr.firstElementChild.innerHTML;
        }
        // console.log(id);
        //把获取的id发送给json-server  删除数据
        axios.delete('http://localhost:3000/game/' + id).then(res => {
            // console.log(res);
            //当返回的状态码为200时候 表示删除成功 刷新页面
            if (res.status == 200) {
                location.reload();
            }
        })
    }
    /********获取数据的方法************/
    getData() {
        //发送ajax请求,获取数据
        axios.get('http://localhost:3000/game'+'?'+'_page=7&_limit=20').then(res => {
            console.log(res);
            //通过解构赋值获取res中的data和status
            let { data, status } = res;
            // console.log(data,status);
            //3、当状态为200时候，表示请求成功
            if (status == 200) {
                //循环遍历出data中的数据
                let html = '';
                data.forEach(ele => {
                    //ele 为data中的每条对象数据
                    // console.log(ele);
                    //拼接字符串
                    html += `<tr>
                <th scope="row">${ele.id}</th>
                <td>${ele.name}</td>
                <td>${ele.age}</td>
                <td>${ele.info}</td>
                <td>
                    <button type="button" class="btn btn-warning btn-xs btn-del">  
                        <span class="glyphicon glyphicon-trash btn-del" aria-hidden="true"></span>
                    </button>
                    <button type="button" class="btn btn-danger btn-xs btn-modify">
                        <span class="glyphicon glyphicon-refresh btn-modify" aria-hidden="true"></span>
                    </button>
                </td>
            </tr>`
                })
            }
            // console.log(html);
            //将拼接的字符串 渲染到页面中
            this.$('.table tbody').innerHTML = html;
        })

    }

    /*************保存数据方法************/
    saveData() {
        //获取每个input节点
        let input = document.forms[0].elements;
        // console.log(input);
        //获取输入框内的内容 去除空格
        let name = input.name.value.trim();
        let age = input.age.value.trim();
        let info = input.info.value.trim();
        // console.log(name,age,info);
        //判断输入框中的内容是否为空 为空时候报错并停止向下执行
        if (!name || !age || !info) {
            alert('输入不能为空');
            return;   //结束执行
        }
        //点击保存显示到页面  
        //利用ajax的post请求 添加数据
        axios.post('http://localhost:3000/game', {
            name, age, info
        }).then(res => {
            // console.log(res);
            //如果状态码为201 代表添加成功 此时已经将数据添加到.json中了
            if (res.status == 201) {
                //刷新页面
                location.reload();
            }
        })
    }

    /****获取节点的封装方法****/
    $(ele) {
        let res = document.querySelector(ele);
        //判断是否返回一个对象还是对象集合
        return res.length == 1 ? res[0] : res;
    }
}
//实例化对象
new Game;