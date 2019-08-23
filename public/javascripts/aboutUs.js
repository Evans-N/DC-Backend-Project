function goToNewPage(){
    const url = document.getElementById('list').value;
    if(url != 'none') {
        window.location = url;
    }
}