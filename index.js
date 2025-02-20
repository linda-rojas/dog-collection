const URL_API_RANDOM = "https://api.thedogapi.com/v1/images/search?limit=3";

const API_URL_FAVOURITES = "https://api.thedogapi.com/v1/favourites";

const API_URL_UPLOAD = "https://api.thedogapi.com/v1/images/upload";

const headerApiKey = {
  "X-Api-Key":
    "live_q1BbdRl99yWlzI2L7g7cilulAlORzJZMGiNP1u4XFnUNs9TXxLfF2xURWiiqEij2",
};

const headerContentType = {
  "Content-Type": "application/json",
};

const headersDefault = {
  ...headerContentType,
  ...headerApiKey,
};

const API_URL_FAVOURITE_DELETE = (id) =>
  `https://api.thedogapi.com/v1/favourites/${id}`;

const spanError = document.getElementById("span");

async function updateDogRandomList() {
  const res = await fetch(URL_API_RANDOM, {
    method: "GET",
    headers: headersDefault,
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");
    const img3 = document.getElementById("img3");

    const btnRandom1 = document.getElementById("btnRandom1");
    const btnRandom2 = document.getElementById("btnRandom2");
    const btnRandom3 = document.getElementById("btnRandom3");

    img1.src = data[0].url;
    img2.src = data[1].url;
    img3.src = data[2].url;

    btnRandom1.onclick = () => saveFavoriteDog(data[0].id);
    btnRandom2.onclick = () => saveFavoriteDog(data[1].id);
    btnRandom3.onclick = () => saveFavoriteDog(data[2].id);
  }
}

async function loadListDogsFavourites() {
  const res = await fetch(API_URL_FAVOURITES, {
    headers: headersDefault,
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    const section = document.getElementById("dogsFavorites");

    const sectionDogsFavourites = document.getElementById(
      "sectionListFavourites"
    );

    section.innerHTML = "";
    const h2 = document.createElement("h2");
    const h2Text = document.createTextNode("Perros favoritos");
    h2.appendChild(h2Text);
    section.appendChild(h2);
    section.appendChild(sectionDogsFavourites);

    data.forEach((dog) => {
      const sectionListFavourites = document.createElement("section");
      const article = document.createElement("article");
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const btnTex = document.createTextNode("Eliminar de mis favoritos");

      img.src = dog.image.url;
      btn.appendChild(btnTex);
      btn.onclick = () => deleteFavouriteDog(dog.id);
      figure.appendChild(img);
      article.appendChild(figure);
      article.appendChild(btn);

      sectionListFavourites.classList.add("sectionCardsDogsFavourite");
      article.classList.add("articleFavourites");
      figure.classList.add("imgFavouriteFigure");
      img.classList.add("imgFavourite");
      btn.classList.add("btnDeleteFavourite");

      sectionDogsFavourites.appendChild(article);
    });
  }
}

async function saveFavoriteDog(id) {
  const body = {
    image_id: id,
  };

  console.log(body);

  const res = await fetch(API_URL_FAVOURITES, {
    method: "POST",
    headers: headersDefault,
    body: JSON.stringify(body),
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
    headers: headersDefault,
  });
  const data = res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error" + res.status + data.message;
  } else {
    loadListDogsFavourites();
  }
}

async function uploadDogImg() {
  const files = document.getElementById("file").files;
  if (files.length === 0) return;
  const [file] = files;
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(API_URL_UPLOAD, {
    method: "POST",
    headers: headerApiKey,
    body: formData,
  });
  const data = await res.json();
  console.log(data);
  saveFavoriteDog(data.id);
}

updateDogRandomList();
loadListDogsFavourites();
