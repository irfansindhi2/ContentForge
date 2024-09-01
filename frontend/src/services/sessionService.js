const sessionService = {
    saveSortOptions(listName, sortOptions) {
      sessionStorage.setItem(`sortOptions_${listName}`, JSON.stringify(sortOptions));
    },
  
    getSortOptions(listName) {
      const sortOptions = sessionStorage.getItem(`sortOptions_${listName}`);
      return sortOptions ? JSON.parse(sortOptions) : null;
    },
  
    saveSearchConditions(listName, searchConditions) {
      sessionStorage.setItem(`searchConditions_${listName}`, JSON.stringify(searchConditions));
    },
  
    getSearchConditions(listName) {
      const searchConditions = sessionStorage.getItem(`searchConditions_${listName}`);
      return searchConditions ? JSON.parse(searchConditions) : null;
    },
  
    clearSessionData() {
      sessionStorage.clear();
    },
  };
  
  export default sessionService;
  