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

            // allow only media files
            uploader.filters.push({
                name: 'medias',
                fn: function(item) {
                    // check mime type, must be video or image
                    var t = item.type.substr(0, 6);
                    // '.ts': allow mpeg ts (it's mime is often text/plain or unknown)
                    var allow = (t === 'video/' || t === 'image/' || t === 'audio/' ||
                                 item.name.substr(item.name.length - 3) === '.ts');
                    if (!allow) {
                        logger.debug('Upload file rejected by filter', item);
                    }
                    return allow;
                }
            });
            uploader.onAfterAddingFile = onAfterAddingFile;
            uploader.onAfterAddingAll = onAfterAddingAll;
        }

        function getUploader() {
            return uploader;
        }

        function onAfterAddingFile(fileItem) {
            // send filename in request headers
            fileItem.headers['Upload-Filename'] = fileItem.file.name;
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
