/**
 * Define Require module with dependencies
 */
define([
  'bootstrap',
  'underscore',
  'backbone',
  'collections/messages',
  'text!templates/messages.html',
  'models/message',
  'models/anonymousLogin',
  'i18n!nls/labels'
], function ($, _, Backbone, MessagesCollection, MessagesTemplate, Message, LoginStatus, i18nLabels) {
  /**
   * Message view which represents the message list
   */
  var MessagesView = Backbone.View.extend({
	el:'body',
    // The view generate a div tag
    tagName:'div',
    // Binding the messages collection
    model:MessagesCollection,
    // Binding the MessagesTemplate loaded by text plugin of Require
    template:_.template(MessagesTemplate),
    events:{
        'click .submitMessage':'submitMessage'
    },
    // View initialization with listening of the collection
    initialize:function () {
      console.log('MessagesView.initialize');
      if(!localStorage.udid) {
    		localStorage.udid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    				/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
      }
      console.log(localStorage.udid);
      LoginStatus.set({
          username:localStorage.udid,
      });
      LoginStatus.save({}, {type: 'put'});
      
      this.model.on('reset', this.render, this);

      MessagesCollection.page = 1;
  	  MessagesCollection.sort = 'timestamp';
  	  MessagesCollection.dir = 'desc';
  	  MessagesCollection.fetchPage();
    },
    // View rendering handler
    render:function () {
      console.log("MessagesView.render", this.model);
      $('.content').html(this.template({
        link:'#messages',
        text:'text',
        user:'user',
        userId:'userId',
        collection:this.model,
        labels:i18nLabels
      }));
//      this.model.each(function (user) {
//        new UserSkillsView({
//          el:this.$('[data-anchor="' + user.get('login') + '"]'),
//          model:user.get('user.User.skills')
//        });
//      });
    },
    submitMessage:function() {
    	Message.set({
    		text:this.$("#newMessage").val(),
    		user:{id:LoginStatus.get("id")},
    	});
    	if (this.$("#newMessage").val()!=='') {
    		Message.save(null,{success:function(model, response){alert("should be this");this.$("#newMessage").val('');showToast();MessagesCollection.fetchPage();},
        		error:function(model, response){this.$("#newMessage").val('');showToast();MessagesCollection.fetchPage();}});
    	}
    }
  });

  // Return the view as the Require module
  return MessagesView;
});
