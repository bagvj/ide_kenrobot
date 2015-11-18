define(["jquery"], function($) {
	  //当前指针
      var cur = 0;
      var listen = function(Egglist,callback){
          $(document).keydown(function(event){

                  if (event.keyCode == Egglist[cur]) {

                    cur++;
                  }else{
                    cur = 0;
                  }

                  if (cur == Egglist.length) {
                    callback();
                    cur = 0;
                  };
              });
      }
      return {
        listen :listen,
      };
});