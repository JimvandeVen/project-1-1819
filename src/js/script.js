import {API} from "/node_modules/oba-wrapper/js/index.js";

const api = new API({key:"1e19898c87464e239192c8bfe422f280"});
// console.log(api)
//Imagine the functions toJson, cleanJSON and
//renderToDocument exist, and do what their
//name says.
(async ()=>{
const iterator = await api.createIterator("search/*&facet=Type(Activiteiten)");
for await (const response of iterator) {
  dataFormatter(response)
}
})();

function dataFormatter(activities){
  activities.map(activity=>{
    createObject(activity)
  })
}

function createObject(activity){
    console.log(activity);
  let activityObject = {
    title: activity.titles.title._text,
    img: activity.coverimages.coverimage._text,
    detailPage: activity["detail-page"]._text,
    // targetAudience: activity["target-audiences"]["target-audience"],
    summary: activity.summaries.summary._text,
    date: activity.summaries.summary._text.substring(0, activity.summaries.summary._text.indexOf(","))
  }
console.log(activityObject);
}
