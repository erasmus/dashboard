Template.bitcoinWallets.helpers({

  bitcoinwalletsinpacks: function (numberInPack) {
    var result = [];
    var temp = [];
    BitcoinWallets.find().forEach(function (wallet) {
      temp.push(wallet);
      if (temp.length > (numberInPack - 1)) {
        result.push(temp);
        temp = [];
      }
    });
    if (temp.length > 0) {
      result.push(temp);
    }
    return result;
  },
  bitcoinwallets: function () {
    return BitcoinWallets.find().fetch();
  },
  dynamicTemplate: function() {
    if (this.action === "add") {
      return "newBitcoinWallet";
    }
    return "";
  },
  singleAddressess: function() {
    return this.singleAddresses();
  }
});

Template.bitcoinWallets.events({
  'click .delete-bitcoin-address': function () {
  return BitcoinAddresses.remove({
    _id: this._id
  });
  }
});



AutoForm.hooks({
  insertBitcoinAddressForm: {
    after: {
      insert: function (err, result, template) {
        if (!err) {
          var address = BitcoinAddresses.findOne({_id: result});
          var wallet = BitcoinWallets.findOne({_id: address.walletId});
          console.log(wallet);
          Meteor.call('updateTx4Wallet', wallet);
        }
      }
    }
  }
});
