// ==UserScript==
// @name         Coinigy Price Converter
// @namespace    https://github.com/akoukoullis/Coinigy-Price-Converter/
// @version      0.1
// @description  Convert the current trading price to another currency
// @author       Anthony Koukoullis
// @include      https://www.coinigy.com/main/markets/*
// @grant        none
// ==/UserScript==

(function(){

    var CPC = CPC || {};

    $(document).ready(function(){

        $(".exchange_logo").append("<div id=\"AUDPrice\" class=\"lastPrice\" style=\"font-size: 16px; font-weight: bold; float: left; margin-left: 15px; margin-top: 8px;\"></div>");

        //Set your destination currency here
        CPC.destinationCurrency = "AUD";
        CPC.$theLastPrice = $("#theLastPrice");
        CPC.$marketName = $(".market_name");
        CPC.$AUDPrice = $("#AUDPrice");

        CPC.currentPrice = 0;
        CPC.lastPrice = parseFloat(CPC.$theLastPrice.html(), 10);

        CPC.fetchPrice = function(){
            $.ajax({url: "https://min-api.cryptocompare.com/data/price?fsym=" + CPC.marketNameArray[0] + "&tsyms=" + CPC.destinationCurrency})
                .done(function(data){
                if((typeof data === "Object" || typeof data === "object") && data.hasOwnProperty("AUD")){
                    CPC.$AUDPrice.html(" (" + CPC.destinationCurrency + "$" + data.AUD + ")");
                }
            });
        };

        CPC.marketNameArray = CPC.$marketName.html().split("/");
        CPC.fetchPrice();

        CPC.AUDPriceTimer = setInterval(function(){

            CPC.marketNameArray = CPC.$marketName.html().split("/");

            if(CPC.marketNameArray[1] !== CPC.destinationCurrency){
                CPC.currentPrice = parseFloat(CPC.$theLastPrice.html(), 10);

                if(CPC.currentPrice !== CPC.lastPrice){
                    CPC.currentPrice = CPC.lastPrice;

                    CPC.fetchPrice();
                }
            }
        }, 1000);
    });
})();
