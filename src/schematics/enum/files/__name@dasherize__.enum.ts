export enum <%= classify(name) %> {<%for (let en of enums) {%>
  <%=en.key%> = '<%=en.value%>',<%}%>
}
