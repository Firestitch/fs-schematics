export const enum <%= classify(name) %> {<%for (let en of enums) {%>
  <%=classify(en.key)%> = '<%=en.value%>',<%}%>
}
