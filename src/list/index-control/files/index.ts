<% for (var i = 0; i < files.length; i++) { %>
export * from './<%=dasherize(files[i])%>';<% }%>
