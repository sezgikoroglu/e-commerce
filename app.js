
var Filter={
    Apis:{
        // Api:"https://dummyjson.com/products/8",
        AllProduct:'https://dummyjson.com/products/' ,
    },
    
    Status:{
        index:0,
        imagess:[],
        info:[],
    },
    Elements:{
        imgDiv:document.querySelector(".image"),
        leftArrow:document.querySelector(".left-arrow"),
        rightArrow:document.querySelector(".right-arrow"),
        progress:document.querySelector(".progress"),
        smallImg:document.querySelector(".small-images"),
        name:document.querySelector(".name"),
        info:document.querySelector(".info"),
        price:document.querySelector(".price"),
       
    },
    Actions:{
        init:()=>{
        
            Filter.Actions.getProduct()
            Filter.Status.index=0
        },

        list:()=>{
           
            var arr=document.querySelectorAll(".small-images img")
            arr.forEach((item)=>{
                item.classList.add("passive");
            })
            arr[Filter.Status.index].classList.remove("passive");
            
            var progress=document.querySelectorAll(".progress div")
            progress.forEach(item=>{
                item.classList.add("passive")
                progress[Filter.Status.index].classList.remove("passive");
            })
       
        },

        addToImg:()=>{
            Filter.Elements.imgDiv.innerHTML="";
            var arr=Filter.Status.imagess;
            var img=document.createElement("img")
            img.classList.add(".image");
            img.setAttribute("src",arr[Filter.Status.index])
            Filter.Elements.imgDiv.appendChild(img);
            
        },
        addToProgress:()=>{
           
            var arr=Filter.Status.imagess;
            arr.forEach(item=>{
                var div=document.createElement("div");
                div.classList.add("progress-div","passive");
                Filter.Elements.progress.appendChild(div);
            } )
            var progress=document.querySelectorAll(".progress div")
            progress[Filter.Status.index].classList.remove("passive")
        },

        addToSmallImg:()=>{
           
            var arr=Filter.Status.imagess;
            arr.forEach((item,i)=>{
                var img=document.createElement("img")
                img.setAttribute("src",item)
                img.classList.add("passive")
                if(i===0){img.classList.remove("passive")}
                Filter.Elements.smallImg.appendChild(img);
                img.addEventListener("mouseover",()=>{
                    var index=Filter.Status.imagess.indexOf(item)
                    img.classList.remove("passive")
                    Filter.Status.index=index;
                    Filter.Actions.addToImg();
                    Filter.Actions.list()
                })
                img.addEventListener("mouseout",()=>{
                    img.classList.add("passive")
                    Filter.Actions.list()
                })
            })
        },

        addToInfo:()=>{
            Filter.Elements.name.innerText=Filter.Status.info.title;
            Filter.Elements.price.innerHTML=Filter.Status.info.price+" $";
            Filter.Elements.info.innerText=Filter.Status.info.description;
           
            const ratingPercentage=((Filter.Status.info.rating)/5)*100;//4.43
            const ratingPercentageRounded=`${Math.round(ratingPercentage/10)*10}%`
            document.querySelector('.star-inner').style.width= ratingPercentageRounded;
            console.log(ratingPercentageRounded)
        },
        
        goLeft:()=>{
            Filter.Status.index--;
            if(Filter.Status.index<=-1){
             Filter.Status.index=Filter.Status.imagess.length-1;
            }
            Filter.Actions.addToImg();
            Filter.Actions.list();
         },

        goRight:()=>{
           
           Filter.Status.index++;
           if(Filter.Status.index>=Filter.Status.imagess.length){
            Filter.Status.index=0;
           }
           Filter.Actions.addToImg();
           Filter.Actions.list();
           
        },

        getProduct:()=>{
        const urlParams=new URLSearchParams(window.location.search);
        console.log(urlParams)
        const id=urlParams.get("id");
        console.log(id)
        if (id){
            fetch(Filter.Apis.AllProduct+id)
            .then(res => res.json())
            .then(res=>{
                var x=res.images;
                Filter.Status.imagess=x;
                Filter.Status.info=res;
                Filter.Actions.addToSmallImg();
                Filter.Actions.addToImg();
                Filter.Actions.addToInfo();
                Filter.Actions.addToProgress();
           });
        }
        }

        
    }

}

Filter.Actions.init()