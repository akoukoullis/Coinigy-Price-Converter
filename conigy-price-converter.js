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

        CPC.destinationCurrency = "JPY";
        CPC.destinationCurrencySymbol = "$";

        $(".exchange_logo").append("<div id=\"destinationCurrencyPriceLarge\" class=\"destinationCurrencyPrice\" class=\"lastPrice\" style=\"display: none; font-size: 26px; font-weight: bold; float: left; margin-left: 15px; margin-top: 8px;\"></div>");
        $(".market_full_name").after("<div id=\"destinationCurrencyPriceSmall\" class=\"destinationCurrencyPrice\" style=\"display: none; position: absolute; top: 4px; left: 140px; font-size: 11px;\"></div>");

        CPC.$theLastPrice = $("#theLastPrice");
        CPC.$marketName = $(".market_name");
        CPC.marketNameArray = CPC.$marketName.html().split("/");
        CPC.originatingCurrency = CPC.marketNameArray[0];

        CPC.$destinationCurrencyPrice = $(".destinationCurrencyPrice");

        CPC.currentPrice = 0;
        CPC.lastPrice = parseFloat(CPC.$theLastPrice.html(), 10);

        CPC.duplicateOhlcTable = function(){
            CPC.$ohlcTable = $("#ohlcTable");
            CPC.$ohlcTableDuplicate = CPC.$ohlcTable.clone();

            CPC.$ohlcTableDuplicate.attr("id", "ohlcTable" + CPC.destinationCurrency);

            CPC.$ohlcTableDuplicate.find(".lastHigh").removeClass("lastHigh").addClass("lastHigh" + CPC.destinationCurrency);
            CPC.$lastHigh = CPC.$ohlcTable.find(".lastHigh");
            CPC.$lastHighNew = CPC.$ohlcTableDuplicate.find(".lastHigh" + CPC.destinationCurrency);

            CPC.$ohlcTableDuplicate.find(".lastLow").removeClass("lastLow").addClass("lastLow" + CPC.destinationCurrency);
            CPC.$lastLow = CPC.$ohlcTable.find(".lastLow");
            CPC.$lastLowNew = CPC.$ohlcTableDuplicate.find(".lastLow" + CPC.destinationCurrency);

            CPC.$ohlcTableDuplicate.find(".currentBid").removeClass("currentBid").addClass("currentBid" + CPC.destinationCurrency);
            CPC.$currentBid = CPC.$ohlcTable.find(".currentBid");
            CPC.$currentBidNew = CPC.$ohlcTableDuplicate.find(".currentBid" + CPC.destinationCurrency);

            CPC.$ohlcTableDuplicate.find(".currentAsk").removeClass("currentAsk").addClass("currentAsk" + CPC.destinationCurrency);
            CPC.$currentAsk = CPC.$ohlcTable.find(".currentAsk");
            CPC.$currentAskNew = CPC.$ohlcTableDuplicate.find(".currentAsk" + CPC.destinationCurrency);

            CPC.$ohlcTableDuplicate.find("tbody > tr > td:nth-child(5), tbody > tr > td:nth-child(6)").remove();
            CPC.$ohlcTableDuplicate.find("td").css("padding-left", "5px");

            CPC.$ohlcTableDuplicate.find(".lastVolume").remove();
            CPC.$ohlcTableDuplicate.css("border-top", "1px solid #ddd");
            CPC.$ohlcTableDuplicate.css("margin-top", "5px");
            CPC.$ohlcTableDuplicate.css("padding-top", "5px");

            $("#ohlcTable").parent().append(CPC.$ohlcTableDuplicate);
        };

        CPC.fetchPrice = function(){

            $.ajax({url: "https://min-api.cryptocompare.com/data/price?fsym=" + CPC.marketNameArray[0] + "&tsyms=" + CPC.destinationCurrency})
            .done(function(data){
                if((typeof data === "Object" || typeof data === "object") && data.hasOwnProperty(CPC.destinationCurrency)){

                    var currentPrice = CPC.currentPrice;
                    if(currentPrice === 0){ currentPrice = CPC.lastPrice; }

                    var destinationCurrencyPrice = parseFloat(data[CPC.destinationCurrency]);
                    var destinationCurrencyRatio = destinationCurrencyPrice / currentPrice;
                    var prefix = CPC.destinationCurrency + CPC.destinationCurrencySymbol;

                    CPC.$destinationCurrencyPrice.html(prefix + destinationCurrencyPrice.toFixed(2));
                    CPC.$lastHighNew.html(prefix + (parseFloat(CPC.$lastHigh.html()) * destinationCurrencyRatio).toFixed(2));
                    CPC.$lastLowNew.html(prefix + (parseFloat(CPC.$lastLow.html()) * destinationCurrencyRatio).toFixed(2));
                    CPC.$currentBidNew.html(prefix + (parseFloat(CPC.$currentBid.html()) * destinationCurrencyRatio).toFixed(2));
                    CPC.$currentAskNew.html(prefix + (parseFloat(CPC.$currentAsk.html()) * destinationCurrencyRatio).toFixed(2));
                }
            });
        };

        CPC.processPrice = function(){
            if(CPC.marketNameArray[1] !== CPC.destinationCurrency){
                CPC.currentPrice = parseFloat(CPC.$theLastPrice.html(), 10);

                if(CPC.currentPrice !== CPC.lastPrice){
                    CPC.lastPrice = CPC.currentPrice;

                    CPC.fetchPrice();
                }
            }
            else {
                CPC.$destinationCurrencyPrice.html("");
            }
        };

        CPC.startTimer = function(){
            CPC.destinationCurrencyPriceTimer = setInterval(function(){

                if($("#exchange_link_holder").is(":visible")){
                    $("#destinationCurrencyPriceLarge").show();
                    $("#destinationCurrencyPriceSmall").hide();
                }
                else {
                    $("#destinationCurrencyPriceLarge").hide();
                    $("#destinationCurrencyPriceSmall").show();
                }

                CPC.marketNameArray = CPC.$marketName.html().split("/");

                CPC.processPrice();
            }, 1000);
        };

        CPC.marketNameArray = CPC.$marketName.html().split("/");

        CPC.duplicateOhlcTable();
        CPC.fetchPrice();
        CPC.startTimer();
    });
})();
