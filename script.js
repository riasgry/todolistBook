document.addEventListener('DOMContentLoaded',function(){
    const submitForm = document.getElementById('submit-btn');
    
    getDate()
    loadMyDataStorage();
    submitForm.addEventListener('click', function(event){
        event.preventDefault();
        addBook();
    });
    
});
function getDate(){
    const today = new Date();
    const date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    document.getElementById("date").value = date;
    return date;
}

let myBook=[];

    function loadMyDataStorage(){
        const loadData = localStorage.getItem('BOOK_DATA')
        const bookData = JSON.parse(loadData)
        if(bookData !== null){
            for(const data of bookData)
            myBook.push(data);
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }




const RENDER_EVENT = 'render-todo';
function addBook(){
    const bookTitle = document.getElementById("title").value;
    const bookAuthor = document.getElementById("author").value;
    const bookRelease = document.getElementById("release_date").value;
    const year = parseInt(bookRelease);
    const startedDate = document.getElementById("date").value;
    const id = generateID()
    const dataBook = generateDataBook(id, bookTitle,bookAuthor,year, startedDate, false)
    myBook.push(dataBook);
        console.log(myBook);
        localStorage.setItem('BOOK_DATA',JSON.stringify(myBook))
    document.dispatchEvent(new Event(RENDER_EVENT));
}
function generateID(){
    return +new Date;   
}

function generateDataBook(id,title,author,year, startat,isRead){
    return{
        id,
        title,
        author,
        year,
        startat,
        isRead
    }
}

function dataBookPreview(dataBook){
    const textTitle = document.createElement('h1');
    textTitle.innerText = dataBook.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerHTML= "<i>Author</i> : <b>"+dataBook.author+"</b>, dirilis pada tahun <b>"+dataBook.year+"<b>."
    const timeStart = document.createElement('p');
    if(!dataBook.isRead){
        timeStart.innerHTML = 'Buku ini dibaca pada <b>'+dataBook.startat+'</b>';
    }else{
        timeStart.innerHTML = 'Buku ini selesai dibaca pada <b>'+dataBook.startat+'</b>';
    }
   

    const textContainer= document.createElement('div');
    textContainer.classList.add('inner');
    
    textContainer.append(textTitle,textAuthor,timeStart);

    const container = document.createElement('div');
    container.classList.add('item','shadow');
    container.append(textContainer);
    container.setAttribute('id', `mybook-${dataBook.id}`);
    
   
    const deleteBook = document.createElement('button');
        deleteBook.classList.add('trash-button')

        deleteBook.addEventListener('click', function(){
            deleteMyBook(dataBook.id)
        })
    if(dataBook.isRead){
        const reRead = document.createElement('button');
        reRead.classList.add('undo-button');

        reRead.addEventListener('click',function(){
            reReadBooks(dataBook.id)
        })

        container.append(reRead, deleteBook)
    }else{
        const checkBook = document.createElement('button')
        checkBook.classList.add('check-button');
        checkBook.addEventListener('click',function(){
            finishedRead(dataBook.id)
        })

        const editBook = document.createElement('button')
        editBook.classList.add('edit-button');
        editBook.addEventListener('click',function(){
            editMyBook(dataBook.id)
        })
        container.append(checkBook,editBook,deleteBook)
    }
    return container;
}

document.addEventListener(RENDER_EVENT,function(){
    const unread = document.getElementById('unread');
    unread.innerHTML=''

    const doneRead = document.getElementById('read');
    doneRead.innerHTML=''
    
    const input = document.getElementById('keyword');
    let searchResult=[]

    input.addEventListener('keyup',function(event){
        event.preventDefault();
        searchResult=[]
        const keywords = input.value;
        console.log(keywords)
        for(let i=0;i<myBook.length;i++){
            const string = document.getElementsByClassName("item")[i];
            if(string.innerText.toLowerCase().indexOf(keywords.toLowerCase())>-1){
                string.style.display=""
            }else{
                string.style.display="none"
            }
        }
    });
    if(input.value==''){
        for(const bookList of myBook){
            const bookElement = dataBookPreview(bookList)
            if(!bookList.isRead){
                unread.append(bookElement);

            }else{
                doneRead.append(bookElement);
            }
            
        }
    }
    
});

function reReadBooks(bookId){
    const targetBook=findBook(bookId);
    targetBook.isRead=false;
    localStorage.setItem('BOOK_DATA',JSON.stringify(myBook))
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteMyBook(bookId){
    const targetBook=findIndexBook(bookId);
    myBook.splice(targetBook,1);
    localStorage.setItem('BOOK_DATA',JSON.stringify(myBook))
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function finishedRead(bookId){
    const targetBook= findBook(bookId)
    targetBook.isRead=true;
    targetBook.startat=getDate();
    localStorage.setItem('BOOK_DATA',JSON.stringify(myBook))
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function editMyBook(bookId){
    const targetBook= findBook(bookId);
    const subbtn=document.getElementById('submit-btn');
    const edtbtn=document.getElementById('edit-btn');
    const cancelbtn=document.getElementById('cancel-btn');
    document.getElementById('form').scrollIntoView();
    document.getElementById('title').value=targetBook.title;
    document.getElementById('author').value=targetBook.author;
    document.getElementById('release_date').value=targetBook.year;
    document.getElementById('date').value=targetBook.startat;
    subbtn.setAttribute('disabled','');
    edtbtn.removeAttribute('disabled');
    cancelbtn.removeAttribute('hidden');

    cancelbtn.addEventListener('click',function(event){
        event.preventDefault();
        document.getElementById('form').reset();
        subbtn.removeAttribute('disabled');
        edtbtn.setAttribute('disabled','');
        cancelbtn.setAttribute('hidden','');

    })

    edtbtn.addEventListener('click',function(event){
        event.preventDefault();
        editBookData(bookId)
    })
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function editBookData(bookId){
    const targetBook=findBook(bookId)
    targetBook['title']=document.getElementById('title').value;
    targetBook['author']=document.getElementById('author').value;
    targetBook['year']=document.getElementById('release_date').value;
    targetBook['startat']=document.getElementById('date').value;
    localStorage.setItem('BOOK_DATA',JSON.stringify(myBook))
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId){
    for(const book of myBook){
        if(book.id==bookId){
            return book;
        }
    }
    return null;
}

function findIndexBook(bookId){
    for(const index in myBook){
        if(myBook[index].id===bookId){
            return index
        }
    }
    return -1;
}
