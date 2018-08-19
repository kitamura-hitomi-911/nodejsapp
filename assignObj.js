var obj = {};
var assignObj = {
	set:function(key,value){
		var current_obj = obj;
		var key_ary = key.split('.');
		key_ary.forEach(function(current_key,index,ary){
			if(index === ary.length -1){
				current_obj[current_key] = value;
			}else{
				current_obj = current_obj[current_key];
			}
		});
		return;
	},
	get:function(key){
		if(key){
			var current_obj = obj;
			var key_ary = key.split('.');
			key_ary.forEach(function(current_key){
				current_obj = current_obj[current_key];
			});
			return current_obj;
		}else{
			return obj;
		}
	}
};
module.exports = assignObj;