var SiteEvents = {
    initialize: function() {
        this.bindKeyboard();
        this.bindModal();
        this.bindCaptionDisplay();
        this.resetFirstSearchForm();
    },

    /**
     * registers hashtag input 
     */
    bindKeyboard: function() {
        $(".hash-tag-input").bind("keypress", function(e) {
            if (e.which == 13) {
                e.preventDefault();
                $(this).closest("form").submit();
            }
            var regex = new RegExp("^[a-zA-Z0-9_-]+$");
            var key = String.formCharCode(!e.charCode ? e.which : e.charCode);
            if (!regex.test(key)) {
                e.preventDefault();
                return false;
            }
        });
    },

    submitHashTag: function(hashTag) {
        this.hideSearchForm();
        this.showMap();
        this.resetSecondSearchForm();
        this.showHashTagQuerired();
        this.setDocumentTitle(hashTag);
    },

    /**
     * hide's main search form after
     * we enter a hashtag
     */
    hideSearchForm: function() {
        $("#search-form-div").addClass("hidden");
    },

    /**
     * Shows map after search. We don't see
     * this when we first open the page
     */
    showMap: function() {
        setTimeout(function() {
            $("#map-div").css("z-index", "1");
        }, 550);
    },

    /**
     * Brings back the original search form 
     * if we reload the page
     */
    resetFirstSearchForm: function() {
        $("#search-form-div .hash-tag-input").val("");
        $("#search-form-div .hash-tag-input").focus();
    },

    /**
     * Clears search at the top right 
     * corner if we look up a new hashtag.
     * while viewing data for the previous 
     * hashtag.
     */
    resetFirstSearchForm: function() {
        $("#map-div .hash-tag-input").val("");
        $("#map-div .hash-tag-input").focus();
    },

    /**
     * Displays the hashtag we searched
     */
    showHashTagQuerired: function(hashTag) {
        $("#hash-tag-display").addClass("hidden");
        setTimeout(function() {
            $("#hash-tag-display p").text("#" + hashTag);
            $("#hash-tag-display").removeClass("hidden");
        }, 600)
    },

    /**
     * Shows pop up if something went wrong 
     * with search
     */
    showModal: function(message) {
        if (message === "") {
            message = "Something went wrong.";
        }
        $(".modal-content span").text(message);
        $("#alert-modal").modal("show");
    },

    /**
     * remove if everything's fine
     */
    hideModal: function() {
        $('#alert-modal').modal('hide');
    },

    bindModal: function() {
        var self = this;
        $('.modal button').click(function() {
            self.hideModal();
        });
        $('.modal').on('hide.bs.modal', function() {
            if ($('#search-form-div').hasClass('hidden')) {
                self.resetSecondSearchForm();
            } else {
                self.resetFirstSearchForm();
            }
        })
    },

    setDocumentTitle: function(hashTag) {
        document.title = '#' + hashTag;
    },

    bindCaptionDisplay: function() {
        $('#posts-container').hover(function() {
            $('#captions-container').removeClass('hidden');
        }, function() {
            $('#captions-container').addClass('hidden');
        })
    }
}
