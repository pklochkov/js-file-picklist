			
	/**
	 * File info storage
	 */
	function FileContent() {
		this.id = '';
		this.fileName = '';
		this.fileContent = '';
		this.fileSize = 0;
	}
	
	function ImageListPickerExtension(){
		/**
		 * Custom style class for generated  image icon element
		 */
		this.imageIconContainerCustomClasses = '';
		/**
		 * Custom classes for file list elelment custom classes
		 */
		this.fileListElementCustomClasses = '';
		/**
		 * Custom style class for generated current image  element
		 */
		this.currentImageCustomClasses = '';
		/**
		 * Custom style class for image container
		 */
		this.currentImageContainerCustomClasses = '';
		
		/**
		 * Id of element that is used for displaying current image
		 */
		this.currentImageId = '';
		/**
		 * Check to use predefined elelement as default
		 */
		this.currentImageUseAsDefault = false;
		/**
		 * Element that displays current image
		 */
		this.currentImageElement;
		/**
		 * 
		 */
		this.fileInputId = '';
		/**
		 * 
		 */
		this.fileInputElement = null;
		/**
		 * 
		 */
		this.fileListElement;
		/**
		 * Flag to override inner html for file list if false generated html will be added at the end 
		 */
		this.overrideFileListHtml = false;
		/**
		 * Flag to override inner html for file input if false generated html will be added at the end 
		 */
		this.overrideFileInputHtml = false;
		/**
		 * Callbac that fires pre html generation
		 */
		this.preHtmlGenerationCallback = null;
		/**
		 * Callback that fires after html was generated
		 */
		this.postHtmlGenerationcallback = null;
		/**
		 * Validate file
		 */
		 this.validateFile = function (file) {
			 
		 }
	}
	/**
	 * 
	 */
	function ImageListPicker(parentId, extension) {
		/**
		 * Hack to make this as object to be seen in methods as {instance} because this is event caller 
		 */
		var instance = this;
		
	 	//Declaration of variables//
	 	this.extension = extension;
		/**
		* Style classes declaration. use them in custom CSS to implement custom design
		*/
		this.inputFilesElementClass = 'img-loader-input-files';
		this.inputFilesElementCustomClasses = '';
		this.imageIconContainerClass = 'img-loader-icon-image-container';
		this.imageIconContainerCustomClasses = '';
		this.fileListElementClass = 'img-loader-files-list';
		this.fileListElementCustomClasses = '';
		this.currentImageClass = 'img-loader-current-image';
		this.currentImageCustomClasses = '';
		this.currentImageContainerClass = [this.currentImageClass, 'container'].join('-');
		this.currentImageContainerCustomClasses = '';
		this.imageIconClass = 'img-loader-icon-image';
		/**
		 * Generated elements IDs in format "{parent-element-id}-{style-class}"
		 * This format needs to provide page-wide uniqness
		 */
		this.inputFilesElementId = [parentId, this.inputFilesElementClass].join('-');
		this.fileListElementId = [parentId, this.fileListElementClass].join('-');
		this.currentImageId = [parentId, this.currentImageClass].join('-');
		this.currentImageContainerId = [parentId, this.currentImageContainerClass].join('-');
		this.parentElement = document.getElementById(parentId);
		
		this.files = [];
		this.inputElement = null;
		this.fileListElement = null;
		this.filesCount = 0;
		this.currentImageContainer = null;
		//Declaration of variables//
		
		this.initFromExtensions = function() {
			if(instance.extension) {		
				if (extension.imageIconContainerCustomClasses) {
					instance.imageIconContainerCustomClasses = instance.extension.imageIconContainerCustomClasses;
				}
				if (extension.fileListElementCustomClasses) {
					instance.fileListElementCustomClasses = instance.extension.fileListElementCustomClasses;
				}
				if (extension.currentImageCustomClasses) {
					instance.currentImageCustomClasses = instance.extension.currentImageCustomClasses;
				}
				if (extension.currentImageCustomClasses) {
					instance.currentImageContainerCustomClasses = instance.extension.currentImageContainerCustomClasses;
				}
				if (extension.inputFilesElementCustomClasses) {
					instance.inputFilesElementCustomClasses = instance.extension.inputFilesElementCustomClasses;
				}
			}
		}
		
		this.initFromExtensions();
		/**
		 * Create HTML for image loader
		 */ 
		this.initImageLoaderStructure = function() {
			var inputFilesElementHTML = ['<input type="file" id="',
										 instance.inputFilesElementId, 
										 '" class="', 
										 //style classes declaration
										 [instance.inputFilesElementClass, instance.inputFilesElementCustomClasses ].join(' '),
										 '" multiple/>'].join('');
			var fileListElementHTML = ['<ul id="', 
										instance.fileListElementId,
										 '" class="', 
									 	//style classes declaration
										[instance.fileListElementClass, instance.fileListElementCustomClasses].join(' '),
										'">',
										'</ul>'].join('');
			var currentImageContainerHTML = ['<div id="', 
												instance.currentImageContainerId,
												'" class = "',
												//style classes declaration
												[instance.currentImageContainerClass, instance.currentImageContainerCustomClasses].join(' '),
												'"></div>'].join('');
			var elementHtml = [inputFilesElementHTML, currentImageContainerHTML, fileListElementHTML].join('');
			instance.parentElement.innerHTML = elementHtml;
			instance.inputElement =  document.getElementById(instance.inputFilesElementId);
			instance.fileListElement = document.getElementById(instance.fileListElementId);
			instance.currentImageContainer = document.getElementById(instance.currentImageContainerId);
			instance.bindStandardEvents();
		}
		
		/**
		 * Bind element standard events
		 */
		this.bindStandardEvents = function() {
			instance.inputElement.addEventListener('change', instance.addItem, false);
		}
		
		
		/**
		 * Method that handles event when input-file adds files
		 * @param evt - event info 
		 */
		this.addItem = function(evt) {
			//TODO replace #DEPID = 0x1
			//Add number of files that were selected to upload
			instance.filesCount += evt.target.files.length;
			for(var i = 0; i < evt.target.files.length; i++){
				var file =  evt.target.files[i];
				var fileName = file.name;
				var fileReader = new FileReader();
				fileReader.onload = (function(theFile) {
					return function(e) {
						var fileContent = new FileContent();
						fileContent.fileName = theFile.name;
						fileContent.fileContent = e.target.result;
						//Generation of unique file id, that will be used as list id
						fileContent.id = [parentId, 'img', instance.files.length, fileContent.fileName].join('-');
						fileContent.fileSize = theFile.size;
						console.log(fileContent.fileSize);
						var addFileValidation ={ 
							result:true,
							errorMessage :''
						};
						//extension usage here 
						if(instance.extension && instance.extension.validateFile) {
							addFileValidation = instance.extension.validateFile(fileContent);
						}
						//extension
						if(addFileValidation.result) {
							instance.files.push(fileContent);
						} else {
							console.log(addFileValidation.errorMessage);
						}
						//TODO replace #DEPID = 0x1
						//flag to render html
						if(instance.filesCount == instance.files.length) {
							instance.createFilesHtml();
						}
					};
				})(evt.target.files[i]);
				fileReader.readAsDataURL(evt.target.files[i]);
			}
		}
		
		
		
		/**
		 * Render HTML when file info added to object model
		 */
		this.createFilesHtml = function() {
			var fileList = instance.fileListElement;
			fileList.innerHTML = '';
			var liTags = [];
			for(var i = 0; i < instance.files.length; i++) {
				var file = instance.files[i];
				liTags.push(
					['<li class="', 
						 //style classes declaration
						[instance.imageIconContainerClass, instance.imageIconContainerCustomClasses].join(' '), 
						'"><img id="',
						file.id,
						'" class="', 
						instance.imageIconClass,
						'" src="', 
						file.fileContent ,
						'"/></li>'].join('')
				);
			}
			instance.fileListElement.innerHTML = liTags.join('');
			instance.afterHtmlCreated();
			instance.setCurrentImage(instance.files[0]);
		}
		
		/**
		 * Set current image
		 */
		this.setCurrentImage = function (file){
			//var currentImg = document.getElementById(instance.currentImageContainer);
			instance.currentImageContainer.innerHTML = ['<img id="'
				, instance.currentImageId,
				 '" class="',
				 //style classes declaration
				 [instance.currentImageClass, instance.currentImageCustomClasses].join(' '),
				 '" src="',
				  file.fileContent ,
				  '" />'].join('');
		}
		/**
		 * Called after HTML was rendered to bind events on generated items
		 */
		this.afterHtmlCreated = function() {
			for(var i = 0; i < instance.files.length; i++) {
				var file = instance.files[i];
				var addedElement = document.getElementById(file.id);
				addedElement.addEventListener('click', function() {
					var id = this.id 
					for(var i = 0; i < instance.files.length; i++){
						if(id == instance.files[i].id) {
							instance.setCurrentImage(instance.files[i]);
						}
					}
				});
			}	
		}
		this.initImageLoaderStructure();
	}
