/**
 * @robot 2021-6-18
 * @example
 *  tree = new tree('#tree'); //可以不填写默认为#tree
 *  tree.InsertNode((el = $('#tree')), true, 'Level 0')
 *  tree.InsertNode((el = $('#tree')), true, 'Level 1')
 *  tree.InsertNode((el = $('#tree')), true, 'Level 2')
 *  tree.InsertNode(tree.treeList[0].node, false, '1-1')
 *  tree.InsertNode(tree.treeList[0].node, false, '1-2')
 *  tree.InsertNode(tree.treeList[0].node, false, '1-3')
 *  tree.InsertNode(tree.treeList[1].node, false, '2-2')
 *  tree.InsertNode(tree.treeList[3].node, false, '1-1-1')
 *  tree.InsertNode(tree.treeList[3].node, false, '1-1-2')
 *  tree.InsertNode(tree.treeList[tree.treeList.length - 1].node, false, '1-1-2-1')
 */
class tree {
    treeList = [];
    base_el = '#tree ';

    constructor(ele = ''){
        if(ele.length > 0)
            this.base_el = ele + ' ';
    }
    /**
     * @description 绑定事件
     * @author Robot 2021-6-18
     */
    Bind_Event = function(){
        $(this.base_el + 'a').unbind();
        $(this.base_el + 'a').on('click', (e) => {
            let $target = $(e.target).parent().next();
            if ($target.css('display') == 'none') {
                $target.removeCss('display');
            } else {
                $target.css('display', 'none');
            }
            $target = $target.prev();
            if ($target.hasClass('tree-close')) {
                $target.addClass('tree-open');
                $target.removeClass('tree-close');
            } else {
                $target.addClass('tree-close');
                $target.removeClass('tree-open');
            }
            this.Bind_Event();
        });
    }
    /**
     * @description 插入叶
     * @author Robot 2021-6-18
     * @param {Element} el 插入位置
     * @param {Boolean} isRoot 是否为根节点
     * @param {String} text 标题
     * @param {String} attr 属性
     */
    InsertNode = (el, isRoot, text, attr = '') => {
        el = $(el);
        let li_node = document.createElement('li');
        let div_node = document.createElement('div');
        let a_node = document.createElement('a');
        let ul_node = document.createElement('ul');
        div_node.className = 'tree tree-leaf tree-title-header';
        a_node.className = 'tree-title';
        a_node.text = text;
        if (attr != '' && attr.split(':').length > 1) {
            a_node.setAttribute(attr.split(':')[0], attr.split(':')[1]);
        }
        div_node.append(a_node);
        li_node.append(div_node);
        li_node.append(ul_node);
        if (!isRoot && this.treeList.includes(this.treeList.find(b => b.node == el[0]))) {
            li_node.className = 'tree tree-boles tree-node';
            this.treeList.push({ level: $(this.base_el)[0], node: li_node });
            el.find('ul:first').append(li_node);
        } else {
            li_node.className = 'tree-root tree tree-boles tree-node';
            this.treeList.push({ level: el, node: li_node });
            el.append(li_node);
        }
        $('ul li').addClass('tree tree-boles');
        $('ul > li').each((index, curr) => { $(curr).parent().find('li:last-child').removeClass('tree tree-boles') })
        $('ul').find('li ul').each((index, curr) => {
            curr = $(curr);
            if (curr.find('li').length > 0) {
                curr.prev().removeClass('tree-leaf');
                curr.prev().addClass('tree-open');
            }
        });
        this.Bind_Event();
    }

    /**
     * @description 删除节点
     * @author Robot 2021-6-18
     * @param {Element} el 
     * @param {String} text 
     * @param {String} attr 
     */
    Remove = (el, text = '', attr = '') => {
        el = $(el);
        if (this.treeList.includes(this.treeList.find(b => b.node == el[0]))) {
            $(el).remove();
        }
    }

    /**
     * @description 清除树所有枝叶
     * @author Robot 2021-6-18
     */
    Clear = () => {
        $(this.base_el).find('*').remove();
    }
}
/**
 * @description 删除css属性
 * @author Robot 2021-6-18
 * @param {String | Array} options CSS属性名
 */
$.fn.removeCss = function (options) {
    var type = typeof (options);
    if (type === "string") {
        this.each(function () {
            var style = $(this).attr("style");
            var arr = style.split(";");
            style = "";
            for (var i = 0; i < arr.length; i++) {
                if ($.trim(arr[i]) == "") {
                    continue;
                }
                var att = arr[i].split(":");
                if ($.trim(att[0]) == $.trim(options)) {
                    continue;
                }
                style += $.trim(arr[i]) + ";";
            }
            $(this).attr("style", style);
        });
    } else if ($.isArray(options)) {
        this.each(function () {
            var style = $(this).attr("style");
            var arr = style.split(";");
            style = "";
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < options.length; j++) {
                    if ($.trim(arr[i]) == "") {
                        break;
                    }
                    var att = arr[i].split(":");
                    if ($.trim(att[0]) == $.trim(options[j])) {
                        arr[i] = "";
                        continue;
                    }
                }
            }
            for (var i = 0; i < arr.length; i++) {
                if ($.trim(arr[i]) != "") {
                    style += $.trim(arr[i]) + ";";
                }
            }
            if ($.trim(style) == "") {
                $(this).removeAttr("style");
            } else {
                $(this).attr("style", style);
            }
        });
    }
};