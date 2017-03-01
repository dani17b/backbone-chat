define([],function() {
  var DateUtils = {
    dateToStr : function(date){
      return this.pad(date.getDate())+"/"+this.pad(date.getMonth()+1)+"/"+this.pad(date.getFullYear());
    },
    timeToStr : function(date){
      return this.pad(date.getHours()) + ":" + this.pad(date.getMinutes());
    },
    pad : function(num){
      return num < 10 ? "0"+num : ""+num;
    }
  };

  return DateUtils;
});
