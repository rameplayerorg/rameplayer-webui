/**
 * Rameplayer WebUI
 * Copyright (C) 2017
 *
 * See LICENSE.
 */

/**
 * List Service
 * @namespace Factories
 */
(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('uploadService', uploadService);

    uploadService.$inject = ['logger', 'FileUploader', '$uibModal'];

    /**
     * @namespace UploaderService
     * @desc Application wide service for uploading files
     * @memberof Factories
     */
    function uploadService(logger, FileUploader, $uibModal) {

        var uploader;
        var modalOpen = false;

        var service = {
            getUploader: getUploader,
            openModal: openModal
        };

        init();

        return service;

        function init() {
            uploader = new FileUploader({
                // upload files as binary
                disableMultipart: true,
            });
            uploader.onAfterAddingFile = onAfterAddingFile;
            uploader.onAfterAddingAll = onAfterAddingAll;
        }

        function getUploader() {
            return uploader;
        }

        function onAfterAddingFile(fileItem) {
            // append filename to url
            var name = encodeURIComponent(fileItem.file.name);
            fileItem.url += '&name=' + name;
        }

        function onAfterAddingAll(addedItems) {
            openModal();
        }

        function openModal(listId) {
            if (!modalOpen) {
                // open modal dialog
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: 'static', // no modal closing by clicking backdrop
                    templateUrl: 'rameplayer/uploader/upload-modal.html',
                    controller: 'UploadModalController',
                    controllerAs: 'vm',
                    resolve: {
                        listId: function() {
                            return listId;
                        }
                    }
                });
                modalInstance.opened.then(function() {
                    modalOpen = true;
                });
                modalInstance.result.then(function() {
                    modalOpen = false;
                }, function() {
                    modalOpen = false;
                });
            }
        }
    }
})();
