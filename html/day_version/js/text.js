const articles = document.querySelectorAll('.article');
articles.forEach((article) => {
    const content = article.querySelector('.article-content');
    article.addEventListener('click', () => {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
});


function openNav() {
    document.getElementById("MYSIDE").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("MYSIDE").style.width = "0";
  }

