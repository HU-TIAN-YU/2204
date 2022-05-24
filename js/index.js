export default class Problem {   
    defaultProps={
        name:'zs',
        age:22
    }
    //实例化类自动调用
    constructor() {
        //获取保存按钮，绑定点击事件
        this.$('.save-data').addEventListener('click', this.saveData);
        //删除点击事件 委托给tbody  将所有的子元素点击事件都委托给它
        //节点事件的回调方法的this指向当前节点对象
        //bind()返回一个新的函数引用，改变其内部this指向
        this.$('.table tbody').addEventListener('click', this.distribute.bind(this))
        this.getData();

        //给模态框的确认删除按钮绑定事件
        this.$('.confirm-del').addEventListener('click', this.confirmDel.bind(this));
        //给修改保存按钮绑定点击事件
        this.$('.modify-data').addEventListener('click', this.saveModify.bind(this));
    }
    /***tbody点击的回调函数*********/
    distribute(eve) {
        // console.log(eve);
        // console.log(this);
        //获取事件源
        let target = eve.target;
        //判断按钮上是否存在指定的类 确定当前点击的是什么按钮
        //删除的button按钮上绑定的类叫btn-del 
        //修改的button按钮上绑定的类叫btn-modify
        // console.log(target.classList.contains('btn-del'));

        //判断点击的是否是删除按钮
        if (target.classList.contains('btn-del')) {
            this.delData(target);
        }
        //判断点击的是否是修改按钮
        if (target.classList.contains('btn-modify')) {
            this.modifyData(target);
        }
    }
    /*
        修改的方法
          1、弹出修改模态框
          2、将原有的数据，显示在模态框中
          3、将修改的数据id,隐藏在修改模态框中
          4、获取表单中数据，不为空则发送给后台
          5、点击确认修改，刷新页面
    */
    //找到tr  span还是button
    findTr(target) {
        // console.log(target);
        //通过上一级找到tr
        //通过递归找到tr
        if(target.nodeName=='TR'){
            return target
        }else{
            return this.findTr(target.parentNode);
        }
    }
    /****修改数据的方法****/
    modifyData(target) {
        // console.log(target);
        let trObj=this.findTr(target);
        // console.log(trObj);
        //弹出模态框
        $('#modifyModal').modal('show');
        //获取要修改的数据，显示到模态框中
        //判断是span还是button,然后找到对应的tr
        // let trObj = '';
        // if (target.nodeName == 'SPAN') {
        //     trObj = target.parentNode.parentNode.parentNode;
        // } else if (target.nodeName == 'BUTTON') {
        //     trObj = target.parentNode.parentNode;
        // }
        // console.log(trObj);
        //获取所有的子节点 分别取出id title pos idea
        let chil = trObj.children;
        // console.log(chil);
        let id = chil[0].innerHTML;
        let title = chil[1].innerHTML;
        let pos = chil[2].innerHTML;
        let idea = chil[3].innerHTML;
        // console.log(id,title,pos,idea);
        //把获取的数据内容 放到修改的表单中
        //先获取input框
        let input = this.$('#modifyModal form').elements;
        // console.log(input);
        //把值放到input框中
        input.title.value = title;
        input.pos.value = pos;
        input.idea.value = idea;
        //将id设置为属性
        this.modifyId = id;

    }
    //修改保存的点击事件
    saveModify() {
        // console.log(this.modifyId);
        //收集表单中的数据
        //先获取input框
        // let input = this.$('#modifyModal form').elements;
        // console.log(input);
        //收集input中的内容
        // let title=input.title.value.trim();
        // let pos=input.pos.value.trim();
        // let idea=input.idea.value.trim();
        // console.log(title,pos,idea);

        //利用解构赋值收集框内的内容
        let { title, pos, idea } = this.$('#modifyModal form').elements;
        // console.log(title, pos, idea);
        let titleVal = title.value.trim();
        let posVal = pos.value.trim();
        let ideaVal = idea.value.trim();
        // console.log(titleVal,posVal,ideaVal);

        //判断非空验证
        // if(!posVal||!titleVal||!titleVal) throw new Error('不能为空');
        //结束代码运行
        if (!posVal || !titleVal || !titleVal) return;

        //给后台发送数据进行修改
        axios.put('http://localhost:3000/problem/' + this.modifyId, {
            title: titleVal,
            pos: posVal,
            idea: ideaVal
        }).then(res => {
            // console.log(res);
            //请求成功则刷新页面
            if (res.status == 200) {
                location.reload();
            }
        })

    }

    /****删除数据的方法****/
    delData(target) {
        // console.log('删除...');
        //将当前准备删除的节点保存到属性上
        this.target = target;
        //1、弹出确认删除的模态框,通过js控制
        //$()是jquery的方法，不是我们封装的方法，不要加this
        $('#delModal').modal('show');

    }
    //2、点击确认 删除
    confirmDel() {
        // console.log(this.target.nodeName);
        let id = 0;
        //确当点击的是span还是button
        if (this.target.nodeName == 'SPAN') {
            let trObj = this.target.parentNode.parentNode.parentNode;
            // console.log(trObj);
            //找到id  第一个子节点
            id = trObj.firstElementChild.innerHTML;
        } else if (this.target.nodeName == 'BUTTON') {
            let trObj = this.target.parentNode.parentNode;
            // console.log(trObj);
            id = trObj.firstElementChild.innerHTML;
        }
        // console.log('确认删除..');
        //将id发送给json-server 服务器，
        axios.delete('http://localhost:3000/problem/' + id).then(res => {
            // console.log(res);
            //判断状态为200时候，删除成功 刷新页面
            if (res.status == 200) {
                location.reload();
            }
        })

    }

    /*****获取数据的方法*********/
    getData() {
        // console.log('这是数据获取');
        //获取tbody  页面中就一个符合条件的，返回单个节点对象
        // console.log(this.$('tbody'));
        //获取div  页面中多个div,返回节点集合
        // let div=this.$('div');
        // console.log(div);


        //1、发送ajax请求 获取数据 获取的数据从db.json中得来的
        axios.get('http://localhost:3000/problem').then(res => {
            // console.log(res);
            //2、获取返回值res中的data和status属性值 (通过解构赋值得到data和status属性的值)
            let { data, status } = res;
            // console.log(data,status);
            //3、当状态为200时候，表示请求成功
            if (status == 200) {
                // console.log(data);
                //4、将获取的数据渲染到页面中
                let html = '';
                //循环遍历data数组中的数据 拼接字符串
                data.forEach(ele => {
                    //ele为数组中的每个对象
                    // console.log(ele);
                    /*
                    删除的第一种思路：直接给行内绑定事件，但回调方法要是静态的static
                       <button type="button" class="btn btn-danger btn-xs"  onclick='Problem.delData()'>
                            <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                        static delData(){
                            console.log(111);
                        }

                    第二种方法：使用事件委托，将删除和修改的点击事件委托给tbody处理
                    */
                    html += `<tr>
                    <th scope="row">${ele.id}</th>
                    <td>${ele.title}</td>
                    <td>${ele.pos}</td>
                    <td>${ele.idea}</td>
                    <td>
                        <button type="button" class="btn btn-danger btn-xs btn-del" >
                            <span class="glyphicon glyphicon-trash btn-del" aria-hidden="true"></span>
                        </button>
                        <button type="button" class="btn btn-warning btn-xs btn-modify">
                            <span class="glyphicon glyphicon-refresh btn-modify" aria-hidden="true"></span>
                        </button>
                    </td>
                </tr>`;
                })
                // console.log(html);
                //5、将拼接的tr追加到页面中
                this.$('.table tbody').innerHTML = html;
            }
        })
    }
    /**********保存数据的方法********/
    saveData() {
        //this指向当前节点对象，保存按钮
        // console.log(this);
        //1、获取表单添加中的 所有的input框
        let form = document.forms[0].elements;
        // console.log(form);
        //获取表单input框中输入的值
        //trim()去除空格
        let title = form.title.value.trim();
        let pos = form.pos.value.trim();
        let idea = form.idea.value.trim();
        // console.log(title,pos,idea);
        //判断表单中每一项是否有值，如果为空，则提示
        if (!title || !pos || !idea) {
            // console.log(111111);
            //抛出错误
            // throw new Error('表单不能为空');
            alert('不能为空!');
            return;
        }
        //3、将数据通过ajax,发送给json-server服务器，进行保存
        //json-server 中，post请求是添加数据的
        axios.post('http://localhost:3000/problem', {
            title,
            pos,
            idea
        }).then(res => {
            // console.log(res);
            //如果添加成功 刷新页面
            if (res.status == 201) {
                location.reload();
            }
        })
    }
    /******获取节点的方法*********/
    $(ele) {
        let res = document.querySelector(ele);
        //判断当前页面只有一个符合条件的就返回单个节点对象，否则返回节点集合
        return res.length == 1 ? res[0] : res;
    }
}
new Problem;