var url;

if(process.env.NODE_ENV === "development") {
   url = '10.10.0.198'
}else {
   url = window.location.hostname
}
export default url