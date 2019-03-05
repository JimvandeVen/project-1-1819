import {API} from "/node_modules/oba-wrapper/js/index.js";

const api = new API({key:"1e19898c87464e239192c8bfe422f280"});

let data = [];

(async ()=>{
const iterator = await api.createIterator("search/*&facet=Type(Activiteiten){100}");
for await (const response of iterator) {

  data.push(...response)
}
dataFormatter(data)
})();

function dataFormatter(activities){
  let thisMonth = []
  let nextMonth = []

  activities.map(activity=>{
    let activityObject = createObject(activity)

    if (activityObject.date.includes("maart") && activityObject.date.substring(0, activityObject.date.indexOf(" ")) !== "maart" && activityObject.date.substring(0, activityObject.date.indexOf(" ")) !== ""){
      thisMonth.push(activityObject)
    } else if (activityObject.date.includes("april") && activityObject.date.substring(0, activityObject.date.indexOf(" ")) !== "april" && activityObject.date.substring(0, activityObject.date.indexOf(" ")) !== ""){
      nextMonth.push(activityObject)
      // console.log(activityObject)
    }
  })

  let thisMonthSorted = thisMonth.sort(function(a,b){
    return a.date.substring(0, a.date.indexOf(" ")) - b.date.substring(0, b.date.indexOf(" "))
  })
  let nextMonthSorted = nextMonth.sort(function(a,b){
    return a.date.substring(0, a.date.indexOf(" ")) - b.date.substring(0, b.date.indexOf(" "))
  })

  createThisMonth(thisMonthSorted, nextMonthSorted)
}

function createObject(activity){
  let activityObject = {
    title: activity.titles.title._text,
    img: activity.coverimages.coverimage._text,
    detailPage: activity["detail-page"]._text,
    summary: activity.summaries.summary._text,
    date: activity.summaries.summary._text.substring(activity.summaries.summary._text.indexOf(" "), activity.summaries.summary._text.indexOf(",")).trim()
  }
  return activityObject
}

function createThisMonth(thisMonthSorted, nextMonthSorted){
  const thisMonthMarkup = thisMonthSorted.map(activity=>{
    return `
    <article>
      <h3>${activity.title}</h3>
      <p>${activity.date}</p>
      <p class="summary"">${activity.summary}</p>
      <div><img src="${activity.img}" alt=""></div>
    </article>
    `
  }).join("")

  const nextMonthMarkup = nextMonthSorted.map(activity=>{
    return `
    <article>
      <h3>${activity.title}</h3>
      <p>${activity.date}</p>
      <p class="summary"">${activity.summary}</p>
      <div><img src="${activity.img}" alt=""></div>
    </article>
    `
  }).join("")

  document.querySelector(".thisMonth").insertAdjacentHTML("afterBegin", thisMonthMarkup)
  document.querySelector(".nextMonth").insertAdjacentHTML("afterBegin", nextMonthMarkup)

}
