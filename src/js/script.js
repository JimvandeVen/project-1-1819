import {API} from "/node_modules/oba-wrapper/js/index.js";
const api = new API({key:"1e19898c87464e239192c8bfe422f280"});

let data = [];

(async ()=>{
  addLoading()
const iterator = await api.createIterator("search/*&facet=Type(Activiteiten){20}");
for await (const response of iterator) {
  data.push(...response)
}

// console.log(data);
createForm(data)
dataFormatter(data)
})();

function addLoading() {
  let loading = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
  const markup = loading.map((activity, i)=>{
    return `
    <article class="loading" style="animation-delay:${i*100}ms">
      <h3 class="loading__title"></h3>
      <p class="loading__date"></p>
      <p class="loading__summary"></p>
      <div><img class="loading__img" src="" alt=""></div>
    </article>
    `
  }).join("")
  // const markup = `
  // ${}
  // <article>
  //   <h3></h3>
  //   <p></p>
  //   <p class="summary""></p>
  //   <div><img src="" alt=""></div>
  // </article>
  // `

  document.querySelector(".thisMonth").insertAdjacentHTML("afterBegin", markup)
}

function createForm(data){
  let allSubjects = []

  data.forEach(activity=>{
    allSubjects.push(activity.subjects["topical-subject"]._attributes["search-term"])
  })

  let uniqueSubjects = [...new Set(allSubjects)]

  const formMarkup = `
  <select name="filter" id="filterSelect">
    <option selected value> -- filter op onderwerp -- </option>
    <option value="all">Alle Onderwerpen</option>
    ${uniqueSubjects.map(subject=>{
      return`
      <option value="${subject}">${subject}</option>
      `
    }).join("")}
  </select>
  `
  document.querySelector(".filterForm").insertAdjacentHTML("afterBegin", formMarkup)
  document.querySelector("#filterSelect").addEventListener("change", filterView)

}

function filterView(){
  let selectedFilter = document.querySelector("#filterSelect").value
  let thisMonth = JSON.parse(localStorage.getItem("thisMonth"))
  let thisMonthFiltered = thisMonth.filter(activity => activity.subject == selectedFilter)
  let nextMonth = JSON.parse(localStorage.getItem("nextMonth"))
  let nextMonthFiltered = nextMonth.filter(activity => activity.subject == selectedFilter)

  if (selectedFilter == "all"){
    createView(thisMonth, nextMonth)
  } else {
    createView(thisMonthFiltered, nextMonthFiltered)
  }
}

function dataFormatter(activities){
  console.log(activities);
  let thisMonth = []
  let nextMonth = []

  activities.map(activity=>{
    let activityObject = createObject(activity)

    if (activity.titles.title._text && activityObject.date.includes("maart") && activityObject.date.substring(0, activityObject.date.indexOf(" ")) !== "maart" && activityObject.date.substring(0, activityObject.date.indexOf(" ")) !== ""){
      thisMonth.push(activityObject)
    } else if ( activity.titles.title._text && activityObject.date.includes("april") && activityObject.date.substring(0, activityObject.date.indexOf(" ")) !== "april" && activityObject.date.substring(0, activityObject.date.indexOf(" ")) !== ""){
      nextMonth.push(activityObject)
    }
  })

  let thisMonthSorted = thisMonth.sort(function(a,b){
    return a.date.substring(0, a.date.indexOf(" ")) - b.date.substring(0, b.date.indexOf(" "))
  })
  let nextMonthSorted = nextMonth.sort(function(a,b){
    return a.date.substring(0, a.date.indexOf(" ")) - b.date.substring(0, b.date.indexOf(" "))
  })
  localStorage.clear();
  localStorage.setItem("thisMonth", JSON.stringify(thisMonthSorted))
  localStorage.setItem("nextMonth", JSON.stringify(nextMonthSorted))
  createView(thisMonthSorted, nextMonthSorted)
}

function createObject(activity){
  let activityObject = {
    title: activity.titles.title._text,
    img: activity.coverimages.coverimage._text,
    detailPage: activity["detail-page"]._text,
    summary: activity.summaries.summary._text,
    date: activity.summaries.summary._text.substring(activity.summaries.summary._text.indexOf(" "), activity.summaries.summary._text.indexOf(",")).trim(),
    subject: activity.subjects["topical-subject"]._attributes["search-term"]
  }
  return activityObject
}

function createView(thisMonth, nextMonth){
  const thisMonthMarkup = thisMonth.map((activity, i)=>{
    return `
    <article style="animation-delay:${i*100}ms">
      <h3>${activity.title}</h3>
      <p>${activity.date}</p>
      <p class="summary"">${activity.summary}</p>
      <div><img src="${activity.img}" alt=""></div>
    </article>
    `
  }).join("")

  const nextMonthMarkup = nextMonth.map((activity, i)=>{
    return `
    <article style="animation-delay:${i*100}ms">
      <h3>${activity.title}</h3>
      <p>${activity.date}</p>
      <p class="summary"">${activity.summary}</p>
      <div><img src="${activity.img}" alt=""></div>
    </article>
    `
  }).join("")
  emptyView()
  document.querySelector(".thisMonth").insertAdjacentHTML("afterBegin", thisMonthMarkup)
  document.querySelector(".nextMonth").insertAdjacentHTML("afterBegin", nextMonthMarkup)

}

function emptyView() {
  const markup = ``
  document.querySelector(".thisMonth").innerHTML = markup
  document.querySelector(".nextMonth").innerHTML = markup
}
