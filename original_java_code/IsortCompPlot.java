/*
 * @author  German Hernandez
*/ 
import java.applet.Applet;
import java.awt.*;    // import the java.awt package
import java.awt.event.*;  // import the java.awt.event package
import java.util.*;

public class IsortCompPlot extends Applet implements ActionListener 
{ 
  static long total = 0;
  static long npermut = 0;
  static double prob[] = new double[1001];
  static int cases [] = new int[1001];
  static int minCase;
  static int maxCase;
  static int n=3;
  Label prompt, prompt2;
  TextField input;   // input values are entered here
  TextArea textarea=new TextArea("",5,10);

 static int isortSteps(int aux[])
 {
    int steps = 0;
    int i,j,k,x;
    
    int v[] = new int[aux.length];
    for(i=0;i < v.length; i++) v[i]=aux[i];
    

    for(i=1;i < v.length; i++)
    {
      x = v[i];
      j = i-1;
      
      
      while( (j > -1)&& (v[j] > x)  ){
          v[j+1] = v[j];
          j--;  
          steps+=1;
          
      }
      if (j != -1) steps++;
      
      v[j+1] = x;
      
    }
    return steps;
    
  }
  
static void swap (int v[], int i, int j) {
  int t;

  t = v[i];
  v[i] = v[j];
  v[j] = t;
}

/* recursive function to generate permutations 
   based on c code from Daniel Jimenez 
   http://www.cs.rutgers.edu/~djimenez
   form his 1998 algorithms class at The University 
   of Texas at San Antonio now his in Rutgers University 
   an the code is available at 
   http://camino.rutgers.edu/ut/utsa/cs3343/index.html
   in Lecture 25: Generating Permutations and Combinations 
*/
static void perm (int v[],int i, int n) {

  /* this function generates the permutations of the array
   * from element i to element n-1
   */
  int j = 0;  
  int k = 0;
  int l = 0;
   
  /* if we are at the end of the array, we have one permutation
   * we can use (here we print it; you could as easily hand the
   * array off to some other function that uses it for something
   */
  if (i == n) {
      
      npermut++;
      //System.out.print("perm("+cases+"): ");
      //for (j=0; j<n; j++) System.out.print(v[j]);
            
      k = isortSteps(v);
      total+=k;
      cases[k]++;
      
      //System.out.println(" "+k);
    
  } else
    /* recursively explore the permutations starting
     * at index i going through index n-1
     */
    for (j=i; j<n; j++) {

      /* try the array with i and j switched */

      swap (v, i, j);
      perm (v, i+1, n);

      /* swap them back the way they were */

      swap (v, i, j);
    }
}

  
public void init()
   {
      setLayout(null);
      resize(1920,1080);
      prompt = new Label( "Enter n:" );
      add( prompt );  // put prompt on applet 

      input = new TextField( 2 );
      input.setText(Integer.toString(n));
      add( input );   // put input TextField on applet

      // "this" applet handles action events for TextField input
      input.addActionListener( this );
      
      prompt2 = new Label ("Distribution");
      add (prompt2);
      add(textarea);
      
      //Relocation of elements in the Applet
      textarea.reshape(450,50,1000,325);
      prompt.reshape(50,10,50,20);
      input.reshape(100,10,30,20);
      prompt2.reshape(450,30,1000,20);
   }

   // process user's action in TextField input 
   public void actionPerformed( ActionEvent e )
   {
      // get the number and convert it to an integer
      n = Integer.parseInt( e.getActionCommand() );
      input.setText(Integer.toString(n));  
      repaint(); 
   }
    
  
  
  
  public void paint(Graphics g) {
    
    int k = 0;
    int v[] = new int[n];
    total = 0;
    npermut = 0;
    minCase=1000;
    maxCase=0;  
    
    for(k=0; k<1001; k++) {
      prob[k] = 0.0;
      cases[k] = 0;
    }
    
    
    for(k=0; k<n; k++){
        v[k]=k+1;
    } 
    
    perm(v,0,n);
    
    for(k=0; k<1001; k++){
          prob[k] = (double) cases[k] / (double) npermut;
          if (( cases[k] != 0) && (minCase > k)) minCase = k;
          if (( cases[k] != 0) && (maxCase < k)) maxCase = k;
    }
    
    g.setColor(Color.black);
    g.drawString("Probability",10,50);
    g.drawString("Steps",350,340);
    g.drawString("n = "+n,155,50);
    g.drawString("Number of permutations = "+ npermut,155,65);
    g.drawString("Average number of steps =  " + +((double) total)/((double)npermut) ,50,380);
    
    //System.out.println(" "+minCase);
    //System.out.println(" "+maxCase);
    
    int y = 80;
    int i = 0;
    
    textarea.setText("");
    for(i=minCase; i <= maxCase; i++) {
      textarea.appendText("P("+i+")="+prob[i]+"["+cases[i]+"]\n");
    }
    
    g.setColor(Color.red);
    g.drawLine(50,50,50,320);
    g.drawLine(50,320,350,320); 
    
    g.setColor(Color.black);
    
    g.drawString("1.0", 10, 70);
    g.drawString("0.8", 10, 120);
    g.drawString("0.6", 10, 170);
    g.drawString("0.4", 10, 220);
    g.drawString("0.2", 10, 270);
    g.drawString("0.0", 10, 320);
    
    int yf;
    int shift = (int) (300.0/(double)(maxCase-minCase+1));
    int ishift = (int) (150.0/(double)(maxCase-minCase+1));
    g.setColor(Color.blue);
    int nlabels =  ((maxCase - minCase)>15) ? (int)(maxCase - minCase)/15 : 1;
    for (i=minCase; i< (maxCase+1); i=i+1){
      if (cases[i] != 0) {
        yf = (int) (prob[i] *250.0) ;
        g.fillRect(50+((i-minCase)*shift),320-yf, shift, yf);
        if (((i - minCase) % nlabels == 0) || (i == maxCase) ) g.drawString(""+i,50+ishift+((i-minCase)*shift) , 330);
      }
    }
    
    
  }   
  
    
  
}


