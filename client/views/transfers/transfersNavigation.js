// on the client
Template.transfersNavigation.helpers({
  noLastPage: function () {
    if(this.page!==this.totalPages){
      return true;
    }
  },
  noZero: function () {
    if(this.page!==1){
      return true;
    }
  },
  pagination: function () {
    var arrayWithNthPages = [];
    for(var i=0; i<this.totalPages; i++){
      arrayWithNthPages.push(i+1);
    }
    return arrayWithNthPages;
  },
  isActive: function (pageNumber) {
    if(pageNumber.toString()===Router.current().params.page){
      return 'active';
    }else{
      return '';
    }
  }
});

Template.transfersNavigation.events({
  'click .delete-transfer': function () {
    return Transfers.remove({
      _id: this._id
    });
  },
  'click .next-page': function () {
    event.preventDefault();
    Router.go('/transfers/'+(this.page+1)+'/'+this.numberOfResultsPerPage);
  },
  'click .prev-page' : function () {
    event.preventDefault();
    var page = this.page-1;
    if(page.get!==0){
      Router.go('/transfers/'+page+'/'+this.numberOfResultsPerPage);
    }else{
      Router.go('/transfers/'+(page+1)+'/'+this.numberOfResultsPerPage);
    }
  },
  'click .go-to-page': function (event) {
    event.preventDefault();
    Router.go('/transfers/'+event.target.attributes[1].value+'/10');
  }
});