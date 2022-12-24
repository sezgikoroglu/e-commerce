var Filter={
    Apis:{
        category:'https://dummyjson.com/products/categories',
        product:"https://dummyjson.com/products",
        search:"https://dummyjson.com/products/search?q=",
        selectCtg:"https://dummyjson.com/products/category/",
      
    },
    Elements:{
        categoryList:document.querySelector("#category-list"),
        categoryTemplate:document.querySelector("#category-template-items"),
        productList:document.getElementById("product-list"),
        productTemplate:document.querySelector("#product-template"),
        searchInput:document.querySelector(".search-input"),
        searchCtgInput:document.getElementById("ctg-search-input"),
        selected:document.getElementById("sort-select"),
        clearButton:document.querySelector(".clear-button"),
        selectCtg:document.getElementById("change-ctg"),
        loadButton:document.getElementById("load-more"),

    },

    Status:{
        products: [] ,
        categories: [],
        query: "",
        selectedCategories: [],
        sort: "",
        skip:0,
        limit:30,
        
    },

    Actions:{
        
        init:()=>  {Filter.Actions.getAllCategories();
                   Filter.Actions.getAllProducts(Filter.Apis.product);
                }
        ,   
        firstCharUpper:(x)=>{
           
            var text=x.replaceAll("-", " ");
            var firstChar=text.charAt(0).toLocaleUpperCase();
            text=firstChar+text.substring(1);
            return text;   
        },
        appendToHTML:{
            addCtg:(x) =>{
                for (let i = 0; i < x.length; i++) {
                const ctg = x[i];
                var div=document.createElement("div");
                div.innerHTML=Filter.Elements.categoryTemplate.innerHTML;
                div.querySelector("input").setAttribute("id",ctg);
                div.querySelector("label").setAttribute("for",ctg);
                div.querySelector("label").innerText=Filter.Actions.firstCharUpper(ctg);
                Filter.Elements.categoryList.appendChild(div.querySelector("li"));
                } 
            },
            
            addProduct:(x)=>{
               
                    var h5=document.createElement("h5");
                    h5.innerText="ÜRÜNLER";
                    var div=document.createElement("div");
                    for (let i = 0; i < x.length; i++) {
                    const item=x[i];    
                    div.innerHTML=Filter.Elements.productTemplate.innerHTML;
                    div.querySelector("a").setAttribute("href","productDetail.html?id=" + item.id);
                    div.querySelector("img").setAttribute("src",item.thumbnail);
                    div.querySelector("h5").innerText=Filter.Actions.firstCharUpper(item.title);
                    div.querySelector("p").innerText=item.description;
                    Filter.Elements.productList.appendChild(div.querySelector("a"));
                   
                }        
            
            },

            addCtgList:(x) =>{
               
                var array=Filter.Status.categories;
                for (let i = 0; i < array.length; i++) {
                    
                    const option=document.createElement("option");
                    option.setAttribute("value",array[i]);
                    option.innerText=Filter.Actions.firstCharUpper(array[i]);
                    Filter.Elements.selectCtg.appendChild(option);
                }
            }
        },  
        isChecked: () => {
           
            const checkedinputs = Filter.Elements.categoryList.querySelectorAll("#category-list input:checked");
            const checkedIds=[];
            var url;
            for (let i = 0; i < checkedinputs.length; i++) {
                const element = checkedinputs[i];
                checkedIds.push(element.id);
                url= Filter.Apis.selectCtg+element.id;
                Filter.Actions.getAllProducts(url);
                Filter.Elements.clearButton.style.display = "block";
                Filter.Elements.productList.innerHTML = "";
            }
        },
        addCtg:(arr)=>{

            for (let i = 0; i < arr.length; i++) {
                var item=arr[i]
                item=Filter.Actions.firstCharUpper(item)
                var option=document.createElement("option");
                option.setAttribute("value",item);
                option.innerText=item;
                Filter.Elements.selectCtg.appendChild(option)
            }
        },
        changeCtg:()=>{
           
            var arr=Filter.Status.categories;
            var item=Filter.Elements.selectCtg.value;
            var val=(arr.filter(x => {return (x.toLocaleLowerCase()==item.toLocaleLowerCase())})).join();
            var url='https://dummyjson.com/products/category/'+val;
            Filter.Elements.productList.innerHTML="";
            Filter.Actions.getAllProducts(url);  
            Filter.Elements.clearButton.style.display="block";
        },
        getSelectedValue:()=>{
           
            var arr=Filter.Status.products;

            if(Filter.Elements.selected.value=="ascPrice"){
                arr.sort((a,b)=>{return a.price-b.price});
            }
            else if(Filter.Elements.selected.value=="descPrice"){
                arr.sort((a,b)=>{return b.price-a.price})
            }
            else if(Filter.Elements.selected.value=="descRate"){
                arr.sort((a,b)=>{return b.rating-a.rating})
            }
            else if(Filter.Elements.selected.value=="descDiscount"){
                arr.sort((a,b)=>{return b.discountPercentage-a.discountPercentage})
            }
            Filter.Elements.productList.innerHTML="";
            Filter.Actions.appendToHTML.addProduct(arr);
            Filter.Elements.clearButton.style.display="block";
           
        },
        clear:()=>{
           
            var inputs=Filter.Elements.categoryList.querySelectorAll("input");
            inputs.forEach(x=>{return (x.checked=false)});
            var searchctg=Filter.Elements.searchCtgInput;
            searchctg.value="";
            var searchProduct=Filter.Elements.searchInput;
            searchProduct.value="";
            Filter.Elements.productList.innerHTML="";
            Filter.Elements.selectCtg.value="";
            Filter.Actions.getAllProducts(Filter.Apis.product);
            Filter.Elements.clearButton.style.display="none"
            
        },
        handleSearch:() =>{
           
            var item=Filter.Elements.searchInput;
            var data=Filter.Status.products;
            var arr=[];
            if(item.value.length > 0){               
                var val=item.value.toLocaleLowerCase();
                arr= data.filter(x => { return x.title.toLocaleLowerCase().includes(val)})
                Filter.Elements.clearButton.style.display="block";
            }
                Filter.Elements.productList.innerHTML= "";
            
            if(arr.length>0){
                Filter.Actions.appendToHTML.addProduct(arr);
            }else{
                Filter.Elements.productList.innerText="SONUÇ BULUNAMADI";
                };

            if(item.value.length == 0){
                Filter.Elements.productList.innerHTML= "";
                Filter.Actions.appendToHTML.addProduct(data);
            }
        },
        handleCtg:()=>{
            var item=Filter.Elements.searchCtgInput;
            var data=Filter.Status.categories;
           
            var arr=[];
            if (item.value.length > 0){
                var val=item.value.toLocaleLowerCase();
                var arr=data.filter(x => {return (x.toLocaleLowerCase().includes(val))})
            }
            Filter.Elements.categoryList.innerHTML="";
            if (arr.length>0){
                Filter.Actions.appendToHTML.addCtg(arr);
            }

            if(item.value.length == 0){
                Filter.Actions.appendToHTML.addCtg(Filter.Status.categories);
            }
        },
        getAllCategories:()=>{
            
            fetch(Filter.Apis.category)
            .then(res=>res.json())
            .then(res => {
                    Filter.Status.categories=res;
                    Filter.Actions.appendToHTML.addCtg(Filter.Status.categories);
                    Filter.Actions.appendToHTML.addCtgList()
             })
        },
        loadmore:()=>{

            const skip=Filter.Status.skip+Filter.Status.limit;
            Filter.Status.skip=skip;
            limit=Filter.Status.limit;
            const url="https://dummyjson.com/products?limit="+limit+"&skip="+skip;
            Filter.Actions.getAllProducts(url);

        },
        getAllProducts:(url)=>{
           
            fetch(url)
            .then (prd => prd.json())
            .then(prd =>{
                    Filter.Status.products=prd.products;
                    Filter.Actions.appendToHTML.addProduct(Filter.Status.products);
                    }
            )
        },
    }
}

Filter.Actions.init();

            
            
