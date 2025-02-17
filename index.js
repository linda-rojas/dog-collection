const URL_API_RANDOM =
  "https://api.thedogapi.com/v1/images/search?limit=2&api_key=live_q1BbdRl99yWlzI2L7g7cilulAlORzJZMGiNP1u4XFnUNs9TXxLfF2xURWiiqEij2";

const API_URL_FAVOURITES =
  "https://api.thedogapi.com/v1/favourites?api_key=live_q1BbdRl99yWlzI2L7g7cilulAlORzJZMGiNP1u4XFnUNs9TXxLfF2xURWiiqEij2";

const API_URL_FAVOURITE_DELETE = (id) =>
  `https://api.thedogapi.com/v1/favourites/${id}?api_key=live_q1BbdRl99yWlzI2L7g7cilulAlORzJZMGiNP1u4XFnUNs9TXxLfF2xURWiiqEij2`;

const spanError = document.getElementById("span");

async function updateDogRandomList() {
  const res = await fetch(URL_API_RANDOM);
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");
    const btnRandom1 = document.getElementById("btnRandom1");
    const btnRandom2 = document.getElementById("btnRandom2");

    img1.src = data[0].url;
    img2.src = data[1].url;

    btnRandom1.onclick = () => saveFavoriteDog(data[0].id);
    btnRandom2.onclick = () => saveFavoriteDog(data[1].id);
  }
}

async function loadListDogsFavourites() {
  const res = await fetch(API_URL_FAVOURITES);
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    const section = document.getElementById("dogsFavorites");
    section.innerHTML = "";
    const h2 = document.createElement("h2");
    const h2Text = document.createTextNode("Perros favoritos");
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.forEach((dog) => {
      const article = document.createElement("article");
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const btnTex = document.createTextNode("Eliminar de mis favoritos");

      img.src = dog.image.url;
      btn.appendChild(btnTex);
      btn.onclick = () => deleteFavouriteCat(dog.id);

      article.appendChild(img);
      article.appendChild(btn);

      section.appendChild(article);
    });
  }
}

async function saveFavoriteDog(id) {
  const res = await fetch(API_URL_FAVOURITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });

  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    loadListDogsFavourites();
  }
}

async function deleteFavouriteDog(id) {
  const res = await fetch(API_URL_FAVOURITE_DELETE(id), {
    method: "DELETE",
  });
  const data = res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error" + res.status + data.message;
  } else {
    loadListDogsFavourites();
  }
}

updateDogRandomList();
loadListDogsFavourites();
