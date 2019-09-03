export * from './<%=dasherize(name)%>.component';
<% if (create) { %>export * from './create';<% } %>
<% if (edit) { %>export * from './edit';<% } %>
<% if (dialog) { %>export * from './<%=dasherize(singleName)%>';<% } %>
